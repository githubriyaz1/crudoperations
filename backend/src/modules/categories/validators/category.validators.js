import { body, param } from "express-validator";
import { validateRequest } from "../../../middlewares/error.middleware.js";

export const validateCreateCategory = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("slug").optional().trim(),
  body("description").optional().trim(),
  body("image").optional().trim(),
  body("icon").optional().trim(),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
  body("sortOrder").optional().isNumeric().withMessage("sortOrder must be a number"),
  validateRequest,
];

export const validateUpdateCategory = [
  param("id").isMongoId().withMessage("Invalid category ID format"),
  body("name").optional().trim().notEmpty().withMessage("Category name cannot be empty"),
  body("slug").optional().trim(),
  body("description").optional().trim(),
  body("image").optional().trim(),
  body("icon").optional().trim(),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
  body("sortOrder").optional().isNumeric().withMessage("sortOrder must be a number"),
  validateRequest,
];
