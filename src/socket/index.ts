import { Server, Socket } from "socket.io";
import * as chatService from "../services/chatService";

export const socketHandler = (socket: Socket, io: Server) => {
  console.log(socket.id + " connected");

  socket.on("join room", async (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    socket.to(roomId).emit("user joined", socket.id);
  });

  socket.on(
    "chat message",
    async (data: { content: string; roomId: string; userId: number }) => {
      const { content, roomId, userId } = data;

      try {
        const savedMessage = await chatService.sendMessage(
          userId,
          +roomId,
          content
        );

        io.to(roomId).emit("chat message", savedMessage);
      } catch (error) {
        console.log("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
  });

};
