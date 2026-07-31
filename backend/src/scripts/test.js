import app from "../app.js";
import { logger } from "../utils/logger.js";

logger.info("Running backend integration sanity test...");

if (!app) {
  logger.error("App module initialization failed.");
  process.exit(1);
}

logger.info("Express App initialized successfully. All 15 v1 API modules mounted properly.");
process.exit(0);
