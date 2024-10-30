import {Router} from "express";
import { authentication } from "../middlewares/authentication";
import upload from "../middlewares/uploadFile";
import * as userController from "../controllers/userController";

const userRouter = Router();

userRouter.put('/', authentication, upload.single('image'), userController.updateUser);
userRouter.get('/', userController.getUser);

export default userRouter