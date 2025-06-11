"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInventoryReductionData = void 0;
const prisma_1 = require("../libs/prisma");
const getInventoryReductionData = async () => {
    const soldData = await prisma_1.prisma.orderItems.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
    });
    const productIds = soldData.map((item) => item.productId);
    const products = await prisma_1.prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, product_name: true, stok: true },
    });
    const formattedData = soldData.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
            productName: product?.product_name || "Unknown",
            initialStock: parseInt(product?.stok || "0"),
            quantitySold: item._sum.quantity || 0,
            remainingStock: parseInt(product?.stok || "0") - (item._sum.quantity || 0),
        };
    });
    return formattedData;
};
exports.getInventoryReductionData = getInventoryReductionData;
