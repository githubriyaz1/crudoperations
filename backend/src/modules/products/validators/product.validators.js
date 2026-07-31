import { body, param } from "express-validator";
import { validateRequest } from "../../../middlewares/error.middleware.js";

export const validateCreateProduct = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price").isNumeric().withMessage("Price must be a valid number"),
  body("oldPrice").optional().isNumeric().withMessage("Old price must be a number"),
  body("discount").optional().isNumeric().withMessage("Discount must be a number"),
  body("stock").optional().isNumeric().withMessage("Stock must be a number"),
  body("category").optional().trim(),
  body("categorySlug").optional().trim(),
  body("badge").optional().trim(),
  body("description").optional().trim(),
  body("image").optional().trim(),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("featured").optional().isBoolean().withMessage("Featured must be a boolean"),
  body("hidden").optional().isBoolean().withMessage("Hidden must be a boolean"),
  validateRequest,
];

export const validateUpdateProduct = [
  param("id").notEmpty().withMessage("Product identifier is required"),
  body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("oldPrice").optional().isNumeric().withMessage("Old price must be a number"),
  body("discount").optional().isNumeric().withMessage("Discount must be a number"),
  body("stock").optional().isNumeric().withMessage("Stock must be a number"),
  body("featured").optional().isBoolean().withMessage("Featured must be a boolean"),
  body("hidden").optional().isBoolean().withMessage("Hidden must be a boolean"),
  validateRequest,
];
