"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePayment = exports.paymentStatus = exports.createOrder = exports.getOrder = void 0;
const orderService = __importStar(require("../services/orderService"));
const axios_1 = __importDefault(require("axios"));
const prisma_1 = require("../libs/prisma");
const client_1 = require("@prisma/client");
const getOrder = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const order = await orderService.getOrder(userId);
        res.status(200).json({ order });
    }
    catch (error) {
        console.log(error);
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.getOrder = getOrder;
const createOrder = async (req, res) => {
    try {
        const { cartId } = req.body;
        if (!cartId) {
            res.status(400).json({ error: "cartId is required" });
        }
        const { transaction } = await orderService.createOrder(cartId);
        res.status(200).json({ transaction });
    }
    catch (error) {
        console.log(error);
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.createOrder = createOrder;
const paymentStatus = async (req, res) => {
    const { orderId } = req.params;
    try {
        const response = await axios_1.default.get(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
            headers: {
                'Authorization': `Basic ${Buffer.from('SB-Mid-server-NsggXUakgJS9BCRRyMBxamM9').toString('base64')}`,
                'Content-Type': 'application/json'
            }
        });
        const { order_id, transaction_status } = response.data;
        const statusMapping = {
            'settlement': client_1.OrderStatus.SUCCESS,
            'pending': client_1.OrderStatus.PENDING,
            'cancel': client_1.OrderStatus.CANCEL,
            'expire': client_1.OrderStatus.CANCEL,
            'deny': client_1.OrderStatus.CANCEL
        };
        const mappedStatus = statusMapping[transaction_status] || client_1.OrderStatus.PENDING;
        const updateOrder = await prisma_1.prisma.order.update({
            where: { id: order_id },
            data: { status: mappedStatus }
        });
        res.status(200).json({ message: 'Order status updated successfully', updateOrder });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.paymentStatus = paymentStatus;
const handlePayment = async (req, res) => {
    const { orderId, transaction_status } = req.body;
    if (!orderId || !transaction_status) {
        res.status(400).json({ error: "Missing required parameters" });
    }
    try {
        const updateOrder = await orderService.handlePaymentStatus(orderId, transaction_status);
        res.status(200).json({ updateOrder });
    }
    catch (error) {
    }
};
exports.handlePayment = handlePayment;
