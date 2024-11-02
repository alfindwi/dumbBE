import { Request, Response } from "express";
import * as cartService from "../services/orderService";

export const getOrder = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id;
        const order = await cartService.getOrder(userId);

        res.status(200).json({ order });
    } catch (error) {
        console.log(error);

        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
}


export const createOrder = async (req: Request, res: Response) => {
    try {
        const {orderId} = req.body

        if (!orderId) {
            res.status(400).json({ error: "orderId is required" });
        }

        const {order, transaction} = await cartService.createOrder(orderId);

        res.status(200).json({ order, transaction });
    } catch (error) {
        console.log(error);

        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
}

