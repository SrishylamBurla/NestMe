import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      socket.on("join", (userId) => {
        socket.join(userId);
      });
    });
  }
};

export const sendNotification = (userId, data) => {
  if (!io) return;
  io.to(userId).emit("notification", data);
};