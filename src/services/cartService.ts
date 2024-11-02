import { parse } from "dotenv";
import { prisma } from "../libs/prisma";

export const getCart = async (userId: number) => {
  try {
    const cart = await prisma.cart.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });
    
    const totalAmount = cart.reduce((acc, item) => acc + item.totalAmount, 0);

    return {
      cart,
      totalAmount,
    };
    return cart;
  } catch (error) {
    throw new Error(`Error getting cart: ${error}`);
  }
};

export const createCartItem = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  try {
    const cartItem = await prisma.$transaction(async (prisma) => {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        throw new Error("Product not found");
      }

      const currentStok = parseInt(product.stok || "0", 10);

      if (quantity > currentStok) {
        throw new Error("Insufficient stock");
      }

      const existingCartItem = await prisma.cart.findFirst({
        where: {
          userId: userId,
          productId: productId,
        },
      });

      if (existingCartItem) {
        throw new Error("Product already in cart");
      }

      const totalAmount = parseInt(product.price || "0", 10) * quantity;

      // create cart item
      const newCartItem = await prisma.cart.create({
        data: {
          userId: userId,
          productId: productId,
          quantity: quantity,
          totalAmount: totalAmount,
        },
        include: {
          product: true,
          user: true,
        },
      });

      // update stok product
      await prisma.product.update({
        where: { id: productId },
        data: {
          stok: (currentStok - quantity).toString(),
        },
      });

      return { newCartItem };
    });

    return cartItem;
  } catch (error) {
    throw new Error(`Error creating cart item: ${(error as Error).message}`);
  }
};

export const createCartToOrder = async (userId: number) => {
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    const existingOrder = await prisma.order.findFirst({
      where: {
        userId,
        orderItems: {
          some: {
            productId: {
              in: cartItems.map((item) => item.productId),
            },
            order: {
              status: "PENDING",
            },
          },
        },
      },
    });

    if (existingOrder) {
      throw new Error("An order already exists for one or more cart items");
    }

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.totalAmount,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId,
        status: "PENDING",
        totalAmount,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            productPrice: parseInt(item.product.price || "0", 10),
            totalPrice: item.totalAmount,
          })),
        },
      },
    });

    setTimeout(async () => {
      const updatedOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          orderItems: true,
        },
      });

      if (updatedOrder?.status === "PENDING") {
        await prisma.orderItem.deleteMany({
          where: {
            orderId: order.id,
          },
        });

        await prisma.order.delete({
          where: { id: order.id },
        });
      }
    }, 60000);

    return order;
  } catch (error) {
    throw new Error(
      `Error creating order from cart: ${(error as Error).message}`
    );
  }
};

export const updateCartItem = async (
  userId: number,
  id: number,
  newQuantity: number
) => {
  try {
    const cartItem = await prisma.$transaction(async (prisma) => {
      const existingCartItem = await prisma.cart.findUnique({
        where: {
          id,
        },
        include: { product: true },
      });

      if (!existingCartItem) {
        throw new Error("Cart item not found");
      }

      if (existingCartItem.userId !== userId) {
        throw new Error("Unauthorized");
      }

      const currenQuantity = existingCartItem.quantity;
      const product = existingCartItem.product;
      const currentStok = parseInt(product.stok || "0", 10);

      const quantityDifference = newQuantity - currenQuantity;

      if (quantityDifference > 0 && currentStok < quantityDifference) {
        throw new Error("Insufficient stock");
      }

      const price = parseFloat(product.price || "0");
      const totalAmount = price * newQuantity;

      const updatedCartItem = await prisma.cart.update({
        where: { id },
        data: {
          quantity: newQuantity,
          totalAmount: totalAmount,
        },
        include: { product: true },
      });

      await prisma.product.update({
        where: { id: product.id },
        data: {
          stok: (currentStok - quantityDifference).toString(),
        },
      });

      return updatedCartItem;
    });

    return cartItem;
  } catch (error) {
    throw new Error(`Error updating cart item: ${(error as Error).message}`);
  }
};


export const deleteCartItem = async (id: number, userId: number) => {
  try {
    const cartItem = await prisma.$transaction(async (prisma) => {
      const existingCartItem = await prisma.cart.findUnique({
        where: { id },
        include: { product: true },
      });

      if (!existingCartItem) {
        throw new Error("Cart item not found");
      }

      if (existingCartItem.userId !== userId) {
        throw new Error("Unauthorized");
      }

      const product = existingCartItem.product;
      const currentStock = parseInt(product.stok || "0", 10);
      const quantityToRestore = existingCartItem.quantity;

      const deletedCartItem = await prisma.cart.delete({
        where: { id },
        include: { product: true, user: true },
      });

      await prisma.product.update({
        where: { id: product.id },
        data: { stok: String(currentStock + quantityToRestore) },
      });

      return deletedCartItem;
    });

    return cartItem;
  } catch (error) {
    throw new Error(`Error deleting cart item: ${(error as Error).message}`);
  }
};
