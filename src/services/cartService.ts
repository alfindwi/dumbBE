import { prisma } from "../libs/prisma";

export const getCart = async () => {
  try {
    const cart = await prisma.cartItem.findMany({
      include: {
        product: true,
      },
    });
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

      const newCartItem = await prisma.cartItem.create({
        data: {
          userId: userId,
          productId: productId,
          quantity: quantity,
        },
        include: {
          product: true,
          user: true,
        },
      });

      await prisma.product.update({
        where: { id: productId },
        data: {
          stok: (currentStok - quantity).toString(),
        },
      });
      return newCartItem;
    });

    return cartItem;
  } catch (error) {
    throw new Error(`Error creating cart item: ${(error as Error).message}`);
  }
};

export const updateCartItem = async (id: number, newQuantity: number) => {
  try {
    const cartItem = await prisma.$transaction(async (prisma) => {
      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          id,
        },
        include: { product: true },
      });

      if (!existingCartItem) {
        throw new Error("Cart item not found");
      }

      const currenQuantity = existingCartItem.quantity;
      const product = existingCartItem.product;
      const currentStok = parseInt(product.stok || "0", 10);

      const quantityDifference = newQuantity - currenQuantity;

      if (quantityDifference > 0 && currentStok < quantityDifference) {
        throw new Error("Insufficient stock");
      }

      const updatedCartItem = await prisma.cartItem.update({
        where: { id },
        data: {
          quantity: newQuantity,
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

export const deleteCartItem = async (id: number) => {
  try {
    // Begin a transaction
    const cartItem = await prisma.$transaction(async (prisma) => {
      // Fetch the cart item with its quantity and associated product
      const existingCartItem = await prisma.cartItem.findUnique({
        where: { id },
        include: { product: true },
      });

      if (!existingCartItem) {
        throw new Error("Cart item not found");
      }

      const product = existingCartItem.product;
      const currentStock = parseInt(product.stok || "0", 10);
      const quantityToRestore = existingCartItem.quantity;

      // Delete the cart item
      const deletedCartItem = await prisma.cartItem.delete({
        where: { id },
        include: { product: true, user: true },
      });

      // Update the product stock by adding back the deleted quantity
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
