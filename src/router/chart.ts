import { Router } from "express";
import { authentication } from "../middlewares/authentication";
import * as chartController from "../controllers/dashboardController";
const chartRouter = Router();

chartRouter.get("/chart", authentication,  chartController.getInventoryReduction);

// orderRouter.get("/payment", orderController.handleMidtransNotification)

export default chartRouter;
