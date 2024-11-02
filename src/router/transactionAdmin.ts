import { Router } from "express";
import * as transactionController from "../controllers/transactionController";
import { authentication } from "../middlewares/authentication";
const transactionRouter = Router();

transactionRouter.get("/transaction", authentication, transactionController.getTransactionAdmin);

export default transactionRouter;
