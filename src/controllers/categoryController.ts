import { Request, Response } from "express";
import * as categoryService from "../services/categoryService";
import { UpdateProductDto } from "../dto/productDto";
import { UpdateCategoryDto } from "../dto/categoryDto";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (user.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    const category = await categoryService.createCategory(req.body);

    res.status(200).json({ category, message: "Product created successfully" });
  } catch (error) {
    console.log("error", error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategory();

    res.status(200).json({ category });
    
  } catch (error) {
    console.log("error", error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const user = res.locals.user;
    const body: UpdateCategoryDto = req.body;

    if (user.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    const product = await categoryService.updateCategory(id, body);

    res.status(200).json({ product, message: "Product updated successfully" });
  } catch (error) {
    console.log("error", error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const user = res.locals.user;

    if (user.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    await categoryService.deleteCategory(id);

    res.status(200).json({ message: "category deleted successfully" });
  } catch (error) {
    console.log("error", error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
