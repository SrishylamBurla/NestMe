import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

let io;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Socket connected");

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("sendMessage", ({ userId, message }) => {
      io.to(userId).emit("newMessage", message);
    });

    socket.on("typing", (userId) => {
      socket.to(userId).emit("typing");
    });
  });

  // 🔥 make socket globally available
  global.io = io;

  server.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});