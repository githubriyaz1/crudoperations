import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

mongoose.set("strictQuery", true);

export async function connectMongoDB() {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    logger.warn(`Primary MongoDB URI failed: ${error.message}. Trying local fallback...`);
    try {
      const fallbackConnection = await mongoose.connect("mongodb://127.0.0.1:27017/love2bazzar", {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
      });
      logger.info(`MongoDB fallback connected: ${fallbackConnection.connection.host}`);
      return fallbackConnection;
    } catch (fallbackError) {
      logger.error("MongoDB fallback connection also failed. Disabling buffering for graceful API fallbacks.", fallbackError);
      mongoose.set("bufferCommands", false);
      throw error;
    }
  }
}
