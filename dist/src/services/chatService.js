"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = exports.sendMessage = exports.getOrCreateRoom = void 0;
const prisma_1 = require("../libs/prisma");
const getOrCreateRoom = async (userId, adminId) => {
    try {
        console.log("Searching for existing room...");
        const room = await prisma_1.prisma.room.findFirst({
            where: {
                AND: [
                    { users: { some: { id: userId } } },
                    { users: { some: { id: adminId } } },
                ],
            },
            include: {
                users: true,
                messages: true,
            },
        });
        if (room) {
            console.log("Room found:", room);
            return room;
        }
        console.log("Room not found, creating a new one...");
        const newRoom = await prisma_1.prisma.room.create({
            data: {
                users: {
                    connect: [{ id: userId }, { id: adminId }],
                },
            },
            include: {
                users: true,
                messages: true,
            },
        });
        console.log("Room created:", newRoom);
        return newRoom;
    }
    catch (error) {
        console.error("Error in getOrCreateRoom:", error);
        throw error;
    }
};
exports.getOrCreateRoom = getOrCreateRoom;
const sendMessage = async (userId, roomId, content) => {
    const messages = await prisma_1.prisma.message.create({
        data: {
            senderId: userId,
            roomId,
            content,
        },
    });
    return messages;
};
exports.sendMessage = sendMessage;
const getMessage = async (roomId) => {
    const messages = await prisma_1.prisma.message.findMany({
        where: {
            roomId,
        },
        include: {
            sender: true,
        }
    });
    return messages;
};
exports.getMessage = getMessage;
