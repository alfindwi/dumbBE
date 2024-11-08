import e, { Request, Response } from "express";
import * as transactionService from "../services/transactionService";

export const getTransactionAdmin = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (user.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
    
    const transaction = await transactionService.getTransaction();

    res.status(200).json({ transaction });
  } catch (error) {
    console.log(error);

    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
