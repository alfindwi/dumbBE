import { Router } from "express";
import * as productController from "../controllers/productController";
import upload from "../middlewares/uploadFile";
import { authentication } from "../middlewares/authentication";
const productRouter = Router();

productRouter.get("/products",productController.getProducts);
productRouter.post("/products",authentication,upload.single("image"),productController.createProduct);
productRouter.put("/products/:id", authentication,upload.single("image"),productController.updateProduct);
productRouter.delete("/products/:id", authentication,productController.deleteProduct);

export default productRouter;
