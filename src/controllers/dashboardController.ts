// src/controllers/inventoryController.ts
import { Request, Response } from "express";
import * as dashboardService from "../services/dashboardService";

export const getInventoryReduction = async (req: Request, res: Response) => {
  try {
    const formattedData = await dashboardService.getInventoryReductionData();
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving inventory data" });
  }
};
