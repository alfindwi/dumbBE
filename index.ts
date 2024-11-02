import express, { Request, Response } from "express";
import router from "./src/router";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { socketHandler } from "./src/socket";
import midtrans from "./src/libs/midtrans";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

io.on("connection", (socket) => {
  socketHandler(socket, io);
});


server.listen(port, () => console.log("Server is running on port 3000"));
