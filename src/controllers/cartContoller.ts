import { Request, Response } from "express";
import * as cartService from "../services/cartService";

export const getCart = async (req: Request, res: Response) => {
    try {
        const cart = await cartService.getCart();

        res.status(200).json({ cart });
    } catch (error) {
        console.log(error);

        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
}

export const createCartItem = async (req: Request, res: Response) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cartItem = await cartService.createCartItem(userId, productId, quantity);

        res.status(200).json({ cartItem });
    } catch (error) {
        console.log(error);

        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
}

export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const { id, quantity } = req.body;
        const cartItem = await cartService.updateCartItem(id, quantity);

        res.status(200).json({ cartItem });
    } catch (error) {
        console.log(error);

        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
};

export const deleteCartItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error("cart id is required");
        }
        const cartItem = await cartService.deleteCartItem(Number(id));

        res.status(200).json({ "message": "cart item deleted", cartItem });
    } catch (error) {
        console.log(error);

        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
};
