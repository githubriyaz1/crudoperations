import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import xss from "xss-clean";
import { env } from "./config/env.js";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";
import v1Routes from "./routes/v1.routes.js";
import { requestLoggerStream } from "./utils/logger.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev", { stream: requestLoggerStream }));
app.use(apiLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Service healthy",
    data: {
      service: "love2bazzar-api",
      status: "ok",
      version: "v1",
      uptime: process.uptime(),
    },
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", v1Routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
