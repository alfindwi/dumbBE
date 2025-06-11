"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const chatService = __importStar(require("../services/chatService"));
const socketHandler = (socket, io) => {
    console.log(socket.id + " connected");
    socket.on("join room", async (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit("user joined", socket.id);
    });
    socket.on("chat message", async (data) => {
        const { content, roomId, userId } = data;
        try {
            const savedMessage = await chatService.sendMessage(userId, +roomId, content);
            io.to(roomId).emit("chat message", savedMessage);
        }
        catch (error) {
            console.log("Error sending message:", error);
            socket.emit("error", { message: "Failed to send message" });
        }
    });
    socket.on("disconnect", () => {
        console.log(socket.id + " disconnected");
    });
};
exports.socketHandler = socketHandler;
