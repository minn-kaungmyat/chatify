import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

//we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId);
}

//for storing online users
const userSocketMap = new Map(); // {userId: socketId}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.fullname} (${socket.userId})`);

  // Store the mapping of userId to socketId
  const userId = socket.userId;
  userSocketMap.set(userId, socket.id);

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  // with socket.on we listen for events from the connected client
  socket.on("disconnect", () => {
    console.log(
      `User disconnected: ${socket.user.fullname} (${socket.userId})`,
    );
    userSocketMap.delete(userId);

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server };
