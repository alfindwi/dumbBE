import { prisma } from "../libs/prisma";

export const getTransaction = async () => {
    try {
      const transactions = await prisma.order.findMany();
  
      return transactions;
    } catch (error) {
      throw new Error(`Error retrieving transaction: ${(error as Error).message}`);
    }
  }