import { parse } from "dotenv";
import { prisma } from "../libs/prisma";
import midtrans from "../libs/midtrans";
import { OrderStatus } from "@prisma/client";

export const getOrder = async (userId: number) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
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
      (sum, item) => sum + (item.totalPrice),
      0
    );

    const parameters = {
      transaction_details: {
        order_id: `ORDER-${cart.id}-${new Date().getTime()}`,
        gross_amount: totalAmount,
      },
      item_details: cart.cartItems.map((item) => ({
        id: item.productId,
        price: item.totalPrice,
        quantity: item.quantity,
        name: `ProductDumbMerch-${item.productId}`,
      })),
    };

    const transaction = await midtrans.createTransaction(parameters);

    const orderId = transaction.order_id; 

    console.log("Created transaction with orderId:", orderId);

    // setTimeout(async () => {
    //   const updatedOrder = await prisma.order.findUnique({
    //     where: { id: orderId },
    //   });

    //   if (updatedOrder?.status === "PENDING") {
    //     await prisma.order.update({
    //       where: { id: orderId },
    //       data: { status: OrderStatus.CANCEL },
    //     });
    //   }
    // }, 10000900000);

    await clearCart(cart.userId);

    return {
      cart,
      transaction,
    };
  } catch (error) {
    throw new Error(`Error creating order item: ${(error as Error).message}`);
  }
};

// export const cancelOrder = async (orderId: string) => {
//   // Ubah tipe menjadi string jika order_id dari Midtrans adalah string
//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: parseInt(orderId) }, // Konversi string menjadi number jika perlu
//     });

//     if (order && order.status === "PENDING") {
//       await prisma.order.update({
//         where: { id: order.id },
//         data: { status: "CANCEL" },
//       });

//       await prisma.cartItem.deleteMany({
//         where: { cartId: order.id }, // Pastikan ini sesuai dengan relasi yang benar
//       });
//     }
//   } catch (error) {
//     throw new Error(`Error canceling order: ${(error as Error).message}`);
//   }
// };

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
