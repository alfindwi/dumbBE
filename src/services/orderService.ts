import { OrderStatus } from "@prisma/client";
import midtrans from "../libs/midtrans";
import { prisma } from "../libs/prisma";

export const getOrder = async (userId: number) => {
  try {
    const orders = await prisma.order.findMany({
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
  } catch (error) {
    throw new Error(`Error retrieving orders: ${(error as Error).message}`);
  }
};

export const createOrder = async (cartId: number) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        cartItems: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );

    const orderId = `ORDER-${cart.id}-${Date.now()}`;

    await prisma.order.create({
      data: {
        id: orderId,
        userId: cart.userId,
        totalAmount,
        status: OrderStatus.PENDING,
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
        order_id: orderId,
        gross_amount: totalAmount,
      },
      item_details: cart.cartItems.map((item) => ({
        id: item.productId.toString(),
        price: item.productPrice,
        quantity: item.quantity,
        name: item.product.product_name,
      })),
 
    };

    const transaction = await midtrans.createTransaction(parameters);

    await clearCart(cart.userId);

    return {
      cart,
      transaction,
      orderId,
    };
  } catch (error) {
    throw new Error(`Error creating order item: ${(error as Error).message}`);
  }
};


export const handlePaymentNotification = async (
  orderId: string,
  transactionStatus: string,
  fraudStatus?: string
) => {
  try {
    console.log("📥 Notification received:", { orderId, transactionStatus, fraudStatus });

    if (orderId.startsWith("payment_notif_test")) {
      return;
    }

    const statusMapping: Record<string, OrderStatus> = {
      settlement: OrderStatus.SUCCESS,
      capture: OrderStatus.SUCCESS,
      pending: OrderStatus.PENDING,
      cancel: OrderStatus.CANCEL,
      expire: OrderStatus.CANCEL,
      deny: OrderStatus.CANCEL,
    };

    const mappedStatus = statusMapping[transactionStatus] || OrderStatus.PENDING;

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: mappedStatus },
    });

    return updatedOrder;
  } catch (error) {
    throw new Error(`Error handling payment notification: ${error}`);
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
};
