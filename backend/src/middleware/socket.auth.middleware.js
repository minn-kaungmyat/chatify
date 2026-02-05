import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // extract token from handshake query
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket authentication failed: No token provided");
      return next(new Error("Unauthorized: Token not provided"));
    }

    // verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket authentication failed: Invalid token");
      return next(new Error("Unauthorized: Invalid token"));
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("Socket authentication failed: User not found");
      return next(new Error("Unauthorized: User not found"));
    }

    socket.user = user; // attach user to socket object
    socket.userId = user._id.toString(); // attach userId to socket object

    console.log(`Socket authenticated: ${user.fullname} (${user._id})`);

    return next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    return next(new Error("Unauthorized: Authentication error"));
  }
};
