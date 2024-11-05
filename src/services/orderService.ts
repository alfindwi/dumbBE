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
          }
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
      where: {
        id: cartId,
      },
      include: {
        cartItems: true,
      },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + item.productPrice * item.quantity, 
      0
    );

    const parameters = {
      transaction_details: {
        order_id: `ORDER-${cart.id}-${new Date().getTime()}`,
        gross_amount: totalAmount,
      },
      item_details: cart.cartItems.map((item) => ({
        id: item.productId,
        price: item.productPrice,
        quantity: item.quantity,
        name: `ProductDumbMerch-${item.productId}`,
      })),
    };

    const transaction = await midtrans.createTransaction(parameters);

    const orderId = transaction.order_id;

    await clearCart(cart.userId);

    return {
      cart,
      transaction,
    };
  } catch (error) {
    throw new Error(`Error creating order item: ${(error as Error).message}`);
  }
};


export const cancelOrder = async (orderId: number) => {
  try {
    if (!orderId) {
      throw new Error("Invalid order ID");
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Lakukan pembatalan dengan mengubah status menjadi "CANCEL"
    const canceledOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCEL" },
    });
    console.log("Order canceled:", canceledOrder);

    return canceledOrder;
  } catch (error) {
    throw new Error(`Error canceling order: ${(error as Error).message}`);
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

// export const updateOrderStatusToSuccess = async (orderId: number) => {
//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: orderId },
//     });

//     if (order) {
//       await prisma.order.update({
//         where: { id: order.id },
//         data: { status: "SUCCESS" },
//       });
//     }
//   } catch (error) {
//     throw new Error(
//       `Error updating order status to success: ${(error as Error).message}`
//     );
//   }
// };
