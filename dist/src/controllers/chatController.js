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
exports.getMessages = exports.sendMessage = exports.getOrCreateRoom = void 0;
const chatService = __importStar(require("../services/chatService"));
const getOrCreateRoom = async (req, res) => {
    const { userId, adminId } = req.query;
    if (!userId || !adminId) {
        res.status(400).json({ error: "Missing required parameters" });
        return;
    }
    try {
        const room = await chatService.getOrCreateRoom(+userId, +adminId);
        res.status(200).json({ room });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get or create room" });
    }
};
exports.getOrCreateRoom = getOrCreateRoom;
const sendMessage = async (req, res) => {
    const userId = res.locals.user.id;
    const { content } = req.body;
    const { roomId } = req.params;
    if (!userId || !roomId || !content) {
        res.status(400).json({ error: "Missing required parameters" });
        return;
    }
    try {
        const message = await chatService.sendMessage(+userId, +roomId, content);
        res.status(200).json({ message });
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
};
exports.sendMessage = sendMessage;
const getMessages = async (req, res) => {
    const { roomId } = req.params;
    if (!roomId) {
        res.status(400).json({ error: "Missing required parameters" });
    }
    try {
        const messages = await chatService.getMessage(+roomId);
        res.status(200).json({ messages });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getMessages = getMessages;
