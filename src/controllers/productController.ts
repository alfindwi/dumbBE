import { Request, Response } from "express";
import * as productService from "../services/productService";
import { UpdateProductDto } from "../dto/productDto";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (user.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }


    const product = await productService.createProduct(req.body, req.file);

    res.status(200).json({ product, message: "Product created successfully" });
  } catch (error) {
    console.log("error", error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();

    res.status(200).json({ products });
    
  } catch (error) {
    console.log("error", error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const user = res.locals.user;
    const body: UpdateProductDto = req.body;

    if (user.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    const product = await productService.updateProduct(id, body, req.file);

    res.status(200).json({ product, message: "Product updated successfully" });
  } catch (error) {
    console.log("error", error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};  

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id;
    const user = res.locals.user;

    if (user.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    await productService.deleteProduct(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("error", error);
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
