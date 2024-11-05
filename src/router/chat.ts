import { Router } from "express";
import { authentication } from "../middlewares/authentication";
import * as chatController from "../controllers/chatController";
const chatRouter = Router();

// chatRouter.get("/rooms", chatController.getOrCreateRoom);
chatRouter.get("/rooms/:roomId/message", chatController.getMessages);

chatRouter.post("/rooms/:roomId/message", chatController.sendMessage);

export default chatRouter;
