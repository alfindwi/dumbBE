import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import productRouter from "./product";
import cartRouter from "./cart";
import categoryRouter from "./category";
import orderRouter from "./order";
import transactionRouter from "./transactionAdmin";

const router = Router()

router.use('/user', userRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)
router.use('/auth', authRouter)
router.use('/admin', productRouter, categoryRouter, transactionRouter)

export default router
