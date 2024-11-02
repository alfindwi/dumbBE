import { Server, Socket } from "socket.io";

const idAdmin = "1";
let socketAdmin: Socket;
const chatUser: string[] = [];

export const socketHandler = (socket: Socket, io: Server) => {
    console.log(socket.id + " connected");
    const userId = socket.handshake.query.userId

    if(userId !== idAdmin){
        chatUser.push(userId as string);
        socket.join(`${userId}${idAdmin}`);
        socket.emit("connected", {rooms: [`${userId}${idAdmin}`]})

        if(socketAdmin){
            socketAdmin.join(`${userId}${idAdmin}`);
        }
    } else {
        socketAdmin = socket;
        const listRooms = chatUser.map((user) => `${user}${idAdmin}`);
        socketAdmin.join(listRooms)
        socketAdmin.emit("connected", {rooms: listRooms})
    }

    socket.on("disconnect", () => {
        console.log(socket.id + " disconnected");
    })

    socket.on("chat message", (data: {message: string; roomId: string}) =>{
        io.to(data.roomId).emit("chat message", data.message)
    })
}
