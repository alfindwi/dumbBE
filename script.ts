import http from 'k6/http';
import { check, sleep } from 'k6';
import { Options } from 'k6/options';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Interface untuk response validation
interface CheckResult {
  [key: string]: boolean;
}

interface ApiResponse {
  status: number;
  body: string;
  timings: {
    duration: number;
  };
}

// Konfigurasi skenario test
export const options: Options = {
  stages: [
    { duration: '10s', target: 50 },   // Ramp-up ke 50 VU dalam 10 detik
    { duration: '50s', target: 100 },  // Ramp-up ke 100 VU dalam 50 detik
    { duration: '10s', target: 0 },    // Ramp-down ke 0 VU dalam 10 detik
  ],
  
  // Threshold untuk performance criteria
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95th percentile harus di bawah 200ms
    http_req_failed: ['rate<0.1'],    // Error rate harus di bawah 10%
    errors: ['rate<0.1'],             // Custom error rate
    response_time: ['p(95)<200'],     // Custom response time metric
  },
};

// Konfigurasi API
const config = {
  baseUrl: 'http://localhost:3000',
  endpoint: '/admin/products',
  expectedStatus: 200,
  maxResponseTime: 200,
  sleepMin: 1,
  sleepMax: 3,
} as const;

// Fungsi untuk generate random sleep time
function getRandomSleep(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Fungsi untuk validasi response
function validateResponse(response: any) {
  return {
    'status is 200': (r: any) => r.status === config.expectedStatus,
    'response time < 200ms': (r: any) => r.timings.duration < config.maxResponseTime,
    'response body is not empty': (r: any) => r.body.length > 0,
    'content-type is JSON': (r: any) => r.headers['Content-Type']?.includes('application/json') || false,
  };
}

// Main test function
export default function (): void {
  const url = `${config.baseUrl}${config.endpoint}`;
  
  // Headers untuk request
  const params = {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'k6-performance-test/1.0',
    },
    timeout: '30s',
  };
  
  // GET request ke endpoint products
  const response = http.get(url, params);
  
  // Record custom metrics
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);
  
  // Validasi response
  const checkResults = validateResponse(response);
  const isValid = check(response, checkResults);

  // Jika response tidak valid, tambahkan error ke custom error rate
  if (!isValid) {
    errorRate.add(1);
  }
  
  // Sleep untuk simulasi user behavior
  const sleepTime = getRandomSleep(config.sleepMin, config.sleepMax);
  sleep(sleepTime);
}

// Setup function (dijalankan sekali di awal)
export function setup(): void {
  console.log('🚀 Starting TypeScript performance test for /admin/products endpoint');
  console.log('📊 Test scenario: 10s->50VU, 50s->100VU, 10s->0VU');
  console.log('🎯 Target: 95th percentile < 200ms');
  console.log(`🌐 Testing URL: ${config.baseUrl}${config.endpoint}`);
  
  // Health check sebelum test
  const healthCheck = http.get(`${config.baseUrl}${config.endpoint}`);
  if (healthCheck.status !== 200) {
    console.error(`❌ Health check failed: ${healthCheck.status}`);
    throw new Error('API not ready for testing');
  } else {
    console.log('✅ Health check passed - API is ready');
  }
}

// Teardown function (dijalankan sekali di akhir)
export function teardown(data: any): void {
  console.log('✅ TypeScript performance test completed!');
  console.log('📊 Check the summary for detailed metrics');
}