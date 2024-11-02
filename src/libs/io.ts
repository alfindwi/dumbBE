import { Server as HttpServer, IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
export let io: Server;

export const ioServer = (
  server: HttpServer<typeof IncomingMessage, typeof ServerResponse>
) => {
  const ioServer = new Server(server),
    io = ioServer;
};
