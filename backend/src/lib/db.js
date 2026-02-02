import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const { MONGO_URL } = ENV;
    if (!MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }
    const conn = await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Database connected: ", conn.connection.host);
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};
