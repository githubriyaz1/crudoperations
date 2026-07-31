import { body, param } from "express-validator";
import { USER_STATUSES } from "../../../constants/roles.js";
import { validateRequest } from "../../../middlewares/error.middleware.js";

export const validateUpdateStatus = [
  param("id").isMongoId().withMessage("Invalid user ID format"),
  body("status")
    .isIn(Object.values(USER_STATUSES))
    .withMessage(`Status must be one of: ${Object.values(USER_STATUSES).join(", ")}`),
  validateRequest,
];

export const validateAddress = [
  body("address").trim().notEmpty().withMessage("Street address is required"),
  body("label").optional().trim().isLength({ max: 50 }).withMessage("Label cannot exceed 50 characters"),
  body("name").optional().trim().isLength({ max: 80 }).withMessage("Name cannot exceed 80 characters"),
  body("phone").optional().trim(),
  body("city").optional().trim(),
  body("state").optional().trim(),
  body("pincode").optional().trim(),
  body("isDefault").optional().isBoolean().withMessage("isDefault must be a boolean"),
  validateRequest,
];
