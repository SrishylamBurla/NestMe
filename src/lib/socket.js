import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "https://nestme.in",
          "https://www.nestme.in",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    io.on("connection", (socket) => {
      console.log("⚡ Connected:", socket.id);

      // 👤 Join user room
      socket.on("join", (userId) => {
        socket.join(userId);
        socket.userId = userId; // 🔥 track user
      });

      // 💬 Send message (REAL FIX)
      socket.on("sendMessage", ({ userId, message }) => {
        if (!userId) return;

        // ✅ send to ALL clients in room (including sender)
        io.to(userId).emit("newMessage", message);
      });

      // ✍️ Typing indicator
      socket.on("typing", (userId) => {
        socket.to(userId).emit("typing");
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected:", socket.id);
      });
    });
  }

  return io;
};

// 🔔 Notification helper
export const sendNotification = (userId, data) => {
  if (!io) return;
  io.to(userId).emit("notification", data);
};

// 💬 Chat helper
export const sendMessageToUser = (userId, message) => {
  if (!io) return;
  io.to(userId).emit("newMessage", message);
};

// ✅ Safe getter
export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};