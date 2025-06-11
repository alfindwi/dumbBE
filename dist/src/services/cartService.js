"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartItem = exports.updateCartItem = exports.createCartItem = exports.getCart = void 0;
const prisma_1 = require("../libs/prisma");
const getCart = async (userId) => {
    try {
        const cart = await prisma_1.prisma.cart.findMany({
            where: {
                userId: userId,
            },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        const totalAmount = cart.reduce((acc, item) => {
            const amount = item.totalAmount || 0; // Pastikan totalAmount valid
            return acc + amount;
        }, 0);
        return { cart, totalAmount };
    }
    catch (error) {
        throw new Error(`Error getting cart: ${error}`);
    }
};
exports.getCart = getCart;
const createCartItem = async (userId, productId) => {
    try {
        let cart = await prisma_1.prisma.cart.findFirst({
            where: { userId },
            include: { cartItems: true },
        });
        if (!cart) {
            cart = await prisma_1.prisma.cart.create({
                data: {
                    userId,
                    totalAmount: 0,
                },
                include: { cartItems: true },
            });
        }
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new Error("Product not found");
        }
        const productStock = parseInt(product.stok || "0");
        const quantity = 1;
        if (productStock < quantity) {
            throw new Error("Not enough stock available");
        }
        const existingCartItem = cart.cartItems.find((item) => item.productId === productId);
        if (existingCartItem) {
            throw new Error("Product already in cart");
        }
        await prisma_1.prisma.product.update({
            where: { id: productId },
            data: { stok: (productStock - quantity).toString() },
        });
        const productPrice = parseInt(product.price || "0");
        if (isNaN(productPrice)) {
            throw new Error("Invalid product price");
        }
        const totalPrice = productPrice * quantity;
        await prisma_1.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
                productPrice: productPrice,
                totalPrice: totalPrice,
            },
        });
        await prisma_1.prisma.cart.update({
            where: { id: cart.id },
            data: {
                totalAmount: {
                    increment: totalPrice,
                },
            },
        });
        const updatedCart = await prisma_1.prisma.cart.findUnique({
            where: { id: cart.id },
            include: { cartItems: true },
        });
        return updatedCart;
    }
    catch (error) {
        throw new Error(`Error creating cart item: ${error}`);
    }
};
exports.createCartItem = createCartItem;
// export const createCartToOrder = async (cartId: number, userId: number) => {
//   try {
//     const cart = await prisma.cart.findUnique({
//       where: {
//         id: cartId,
//         userId: userId,
//       },
//       include: {
//         cartItems: true,
//       },
//     });
//     if (!cart) {
//       throw new Error("Cart not found");
//     }
//     const totalAmount = cart.cartItems.reduce((sum, item) => {
//       return sum + item.totalPrice;
//     }, 0);
//     // Buat order baru
//     const order = await prisma.order.create({
//       data: {
//         userId: cart.userId,
//         totalAmount: totalAmount,
//         status: OrderStatus.PENDING,
//       },
//     });
//     const orderItems = cart.cartItems.map((item) => ({
//       orderId: order.id,
//       productId: item.productId,
//       quantity: item.quantity,
//       productPrice: item.productPrice,
//       totalPrice: item.totalPrice,
//     }));
//     await prisma.orderItems.createMany({
//       data: orderItems,
//     });
//     return order;
//   } catch (error) {
//     throw new Error(
//       `Error creating order from cart: ${(error as Error).message}`
//     );
//   }
// };
const updateCartItem = async (userId, cartItemId, newQuantity) => {
    try {
        console.log(`Updating cart item: userId=${userId}, cartItemId=${cartItemId}, newQuantity=${newQuantity}`);
        // Pastikan newQuantity adalah angka dan valid
        if (newQuantity === undefined || isNaN(newQuantity)) {
            throw new Error("New quantity is required and must be a valid number");
        }
        const cartItem = await prisma_1.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { product: true, cart: true },
        });
        if (!cartItem || cartItem.cart.userId !== userId) {
            throw new Error("Cart item not found or unauthorized");
        }
        const product = cartItem.product;
        const currentQuantity = cartItem.quantity;
        const productStok = parseInt(product.stok || "0");
        if (isNaN(productStok)) {
            throw new Error("Invalid stock value for the product");
        }
        const quantityDiff = newQuantity - currentQuantity;
        if (quantityDiff > 0 && quantityDiff > productStok) {
            throw new Error("Not enough stock available");
        }
        const updatedStock = productStok - quantityDiff;
        await prisma_1.prisma.product.update({
            where: { id: product.id },
            data: { stok: updatedStock.toString() },
        });
        const productPrice = parseInt(cartItem.productPrice?.toString() || "0");
        // Log nilai untuk memastikan productPrice dan newQuantity
        console.log("Product Price:", productPrice);
        console.log("New Quantity:", newQuantity);
        const newTotalPrice = productPrice * newQuantity;
        if (isNaN(newTotalPrice)) {
            throw new Error("Invalid total price calculation after multiplication");
        }
        await prisma_1.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity: newQuantity, totalPrice: newTotalPrice },
        });
        const cartItems = await prisma_1.prisma.cartItem.findMany({
            where: { cartId: cartItem.cartId },
        });
        const totalAmount = cartItems.reduce((acc, item) => acc + parseInt(item.totalPrice?.toString() || "0"), 0);
        await prisma_1.prisma.cart.update({
            where: { id: cartItem.cartId },
            data: { totalAmount: totalAmount },
        });
        return await prisma_1.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { product: true },
        });
    }
    catch (error) {
        console.error(`Error updating cart item: ${error.message}`);
        throw new Error(`Error updating cart item: ${error.message}`);
    }
};
exports.updateCartItem = updateCartItem;
const deleteCartItem = async (cartItemId, userId) => {
    try {
        const cartItem = await prisma_1.prisma.cartItem.findUnique({
            where: {
                id: cartItemId,
            },
            include: {
                cart: true,
                product: true,
            },
        });
        if (!cartItem) {
            throw new Error("Cart item not found");
        }
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const productStock = parseInt(cartItem.product.stok || "0");
        const newStock = productStock + cartItem.quantity;
        await prisma_1.prisma.product.update({
            where: { id: cartItem.product.id },
            data: { stok: newStock.toString() },
        });
        await prisma_1.prisma.cartItem.delete({
            where: { id: cartItemId },
        });
        const cartItems = await prisma_1.prisma.cartItem.findMany({
            where: { cartId: cartItem.cartId },
        });
        const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
        await prisma_1.prisma.cart.update({
            where: { id: cartItem.cartId },
            data: { totalAmount: totalAmount },
        });
    }
    catch (error) {
        throw new Error(`Error deleting cart: ${error}`);
    }
};
exports.deleteCartItem = deleteCartItem;
