import { parse } from "dotenv";
import { prisma } from "../libs/prisma";
import midtrans from "../libs/midtrans";

export const getOrder = async (userId: number) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return orders;
  } catch (error) {
    throw new Error(`Error retrieving orders: ${(error as Error).message}`);
  }
};


export const createOrder = async (orderId: number) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            order: {
              include :{
                orderItems: true
              }
            }
          }
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const totalAmount = order.orderItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const parameters = {
      transaction_details: {
        order_id: `ORDER-${order.id}-${new Date().getTime()}`,
        gross_amount: totalAmount,
      },
      item_details: order.orderItems.map((item) => ({
        id: item.id,
        price: item.productPrice,
        quantity: item.quantity,
        name: `Product-${item.productId}`,
      })),

    };

    const transaction = await midtrans.createTransaction(parameters);

    await clearCart(order.userId);
    return {
      order,
      transaction,
    };
  } catch (error) {
    throw new Error(`Error creating order item: ${(error as Error).message}`);
  }
};

export const clearCart = async (userId: number) => {
  try {
    await prisma.cart.deleteMany({
      where: {
        userId,
      },
    });
  } catch (error) {
    throw new Error(`Error clearing cart: ${(error as Error).message}`);
  }
}