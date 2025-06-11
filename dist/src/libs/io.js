"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioServer = exports.io = void 0;
const socket_io_1 = require("socket.io");
const ioServer = (server) => {
    const ioServer = new socket_io_1.Server(server), io = ioServer;
};
exports.ioServer = ioServer;
