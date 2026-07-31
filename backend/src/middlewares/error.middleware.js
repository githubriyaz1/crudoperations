import { validationResult } from "express-validator";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { logger } from "../utils/logger.js";

export function validateRequest(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));
  return next(new ApiError(422, "Validation failed", errors));
}

export function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const isProduction = env.NODE_ENV === "production";

  if (statusCode >= 500) {
    logger.error("Unhandled API error", error);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 && isProduction ? "Internal server error" : error.message,
    errors: error.errors || [],
    ...(isProduction ? {} : { stack: error.stack }),
  });
}
