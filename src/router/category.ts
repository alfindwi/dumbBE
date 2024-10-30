import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import upload from "../middlewares/uploadFile";
import { authentication } from "../middlewares/authentication";
const categoryRouter = Router();

categoryRouter.get("/category",categoryController.getCategory);
categoryRouter.post("/category",authentication,categoryController.createCategory);
categoryRouter.put("/category/:id", authentication,categoryController.updateCategory);
categoryRouter.delete("/category/:id", authentication,categoryController.deleteCategory);

export default categoryRouter;
