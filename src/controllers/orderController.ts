import { Request, Response } from "express";
import * as orderService from "../services/orderService";

export const getOrder = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;
    const order = await orderService.getOrder(userId);

    res.status(200).json({ order });
  } catch (error) {
    console.log(error);

    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { cartId } = req.body;

    if (!cartId) {
      res.status(400).json({ error: "cartId is required" });
    }

    const { transaction } = await orderService.createOrder(cartId);

    res.status(200).json({ transaction });
  } catch (error) {
    console.log(error);

    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

// export const handleMidtransNotification = async (
//   req: Request,
//   res: Response
// ) => {
//   const { order_id, transaction_status } = req.body;

//   console.log("Received notification:", { order_id, transaction_status });

//   if (transaction_status === "capture") {
//     // Pastikan order_id memiliki format yang benar, misalnya ambil ID numeriknya
//     const orderNumber = parseInt(order_id.split("-")[1]); // Ambil ID dari order_id yang formatnya sesuai
//     await orderService.updateOrderStatusToSuccess(orderNumber);
//     res.status(200).json({ message: "Order updated to SUCCESS" });
//   }

//   res.status(200).json({ message: "No action taken" });
// };
