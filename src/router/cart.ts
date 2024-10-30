import { Router } from "express";
import * as cartController from "../controllers/cartContoller";
const cartRouter = Router();

cartRouter.get("/", cartController.getCart);
cartRouter.post("/", cartController.createCartItem);

cartRouter.put("/:id", cartController.updateCartItem);

cartRouter.delete("/:id", cartController.deleteCartItem);

export default cartRouter;
