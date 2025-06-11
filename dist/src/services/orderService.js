"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.handlePaymentStatus = exports.createOrder = exports.getOrder = void 0;
const midtrans_1 = __importDefault(require("../libs/midtrans"));
const prisma_1 = require("../libs/prisma");
const MIDTRANS_SERVER_KEY = process.env.MT_SERVER_KEY;
const getOrder = async (userId) => {
    try {
        const orders = await prisma_1.prisma.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                OrderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return orders;
    }
    catch (error) {
        throw new Error(`Error retrieving orders: ${error.message}`);
    }
};
exports.getOrder = getOrder;
const createOrder = async (cartId) => {
    try {
        const cart = await prisma_1.prisma.cart.findUnique({
            where: { id: cartId },
            include: { cartItems: true },
        });
        if (!cart) {
            throw new Error("Cart not found");
        }
        const totalAmount = cart.cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
        const orderId = `ORDER-${cart.id}-${new Date().getTime()}`;
        const order = await prisma_1.prisma.order.create({
            data: {
                id: orderId,
                userId: cart.userId,
                totalAmount,
                OrderItems: {
                    create: cart.cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        productPrice: item.productPrice,
                        totalPrice: item.productPrice * item.quantity,
                    })),
                },
            },
        });
        const parameters = {
            transaction_details: {
                order_id: orderId, // Use the same orderId here for the transaction
                gross_amount: totalAmount,
            },
            item_details: cart.cartItems.map((item) => ({
                id: item.productId.toString(),
                price: item.productPrice,
                quantity: item.quantity,
                name: `ProductDumbMerch-${item.productId}`,
            })),
            callbacks: {
                finish: "http://localhost:5173"
            }
        };
        const transaction = await midtrans_1.default.createTransaction(parameters);
        await (0, exports.clearCart)(cart.userId);
        return {
            cart,
            transaction,
            order,
        };
    }
    catch (error) {
        throw new Error(`Error creating order item: ${error.message}`);
    }
};
exports.createOrder = createOrder;
const handlePaymentStatus = async (orderId, transaction_status) => {
    try {
        let status = "CANCEL";
        if (transaction_status === "settlement") {
            status = "SUCCESS";
        }
        const updateOrder = await prisma_1.prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        return updateOrder;
    }
    catch (error) {
    }
};
exports.handlePaymentStatus = handlePaymentStatus;
const clearCart = async (userId) => {
    try {
        await prisma_1.prisma.cart.deleteMany({
            where: {
                userId,
            },
        });
    }
    catch (error) {
        throw new Error(`Error clearing cart: ${error.message}`);
    }
};
exports.clearCart = clearCart;
