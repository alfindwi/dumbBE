import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { authentication } from "../middlewares/authentication";
const orderRouter = Router();

orderRouter.get("/", authentication, orderController.getOrder);
orderRouter.post("/", authentication ,orderController.createOrder);

export default orderRouter;