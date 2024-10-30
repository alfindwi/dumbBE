import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import productRouter from "./product";
import cartRouter from "./cart";
import categoryRouter from "./category";

const router = Router()

router.use('/user', userRouter)
router.use('/cart', cartRouter)
router.use('/auth', authRouter)
router.use('/admin', productRouter, categoryRouter)

export default router
