import e, { Request, Response } from "express";
import * as cartService from "../services/cartService";

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;
    const cart = await cartService.getCart(userId);

    res.status(200).json({ cart });
  } catch (error) {
    console.log(error);

    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const createCartItem = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;
    const { productId, quantity = 1 } = req.body;
    const cartItem = await cartService.createCartItem(
      userId,
      productId,
      quantity
    );

    res.status(200).json({ cartItem });
  } catch (error) {
    console.log(error);

    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const checkout = async (req: Request, res: Response) => {
  const userId = res.locals.user.id;
  try {
    const order = await cartService.createCartToOrder(userId);
    res.status(201).json({
      message: "order created successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      message: `Error creating order: ${(error as Error).message}`,
    });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id;
    const id = req.params.id;
    const { quantity } = req.body;
    const cartItem = await cartService.updateCartItem(
      userId,
      Number(id),
      quantity
    );

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
    const userId = res.locals.user.id;

    if (!id) {
      throw new Error("cart id is required");
    }
    const cartItem = await cartService.deleteCartItem(Number(id), userId);

    res.status(200).json({ message: "cart item deleted", cartItem });
  } catch (error) {
    console.log(error);

    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
