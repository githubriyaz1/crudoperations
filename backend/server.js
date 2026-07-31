import http from "node:http";
import app from "./src/app.js";
import { connectMongoDB } from "./src/config/database.js";
import { env } from "./src/config/env.js";
import { runAutoSeed } from "./src/scripts/seed.js";
import { logger } from "./src/utils/logger.js";

const server = http.createServer(app);

async function startServer() {
  try {
    await connectMongoDB();
    await runAutoSeed();
  } catch (err) {
    logger.warn(`Server starting with partial/fallback configuration: ${err.message}`);
  }

  server.listen(env.PORT, () => {
    logger.info(`Love2Bazzar API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
}

function shutdown(signal) {
  logger.info(`${signal} received. Closing HTTP server...`);
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error);
});

startServer().catch((error) => {
  logger.error("Failed to start server", error);
});
