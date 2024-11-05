import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import productRouter from "./product";
import cartRouter from "./cart";
import categoryRouter from "./category";
import orderRouter from "./order";
import transactionRouter from "./transactionAdmin";
import chartRouter from "./chart";
import chatRouter from "./chat";

const router = Router()

router.use('/user', userRouter)
router.use('/cart', cartRouter)
router.use('/chat', chatRouter)
router.use('/order', orderRouter)
router.use('/auth', authRouter)
router.use('/admin', productRouter, categoryRouter, transactionRouter, chartRouter)

export default router
