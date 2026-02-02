import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected: ", conn.connection.host);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // 1 status code means fail, 0 means success
  }
};
