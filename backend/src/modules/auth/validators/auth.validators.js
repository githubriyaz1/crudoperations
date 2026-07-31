import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2 to 80 characters."),
  body("email").trim().isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("phone").optional({ values: "falsy" }).trim().isLength({ min: 7, max: 20 }).withMessage("Phone must be 7 to 20 characters."),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

export const refreshValidator = [
  body("refreshToken").optional({ values: "falsy" }).isString().withMessage("Refresh token must be a string."),
];

export const updateMeValidator = [
  body("name").optional().trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2 to 80 characters."),
  body("phone").optional({ values: "falsy" }).trim().isLength({ min: 7, max: 20 }).withMessage("Phone must be 7 to 20 characters."),
  body("addresses").optional().isArray({ max: 5 }).withMessage("Addresses must be an array with up to 5 entries."),
  body("addresses.*.address").optional().trim().isLength({ min: 8 }).withMessage("Address must be at least 8 characters."),
  body("addresses.*.city").optional({ values: "falsy" }).trim().isLength({ max: 80 }).withMessage("City is too long."),
  body("addresses.*.state").optional({ values: "falsy" }).trim().isLength({ max: 80 }).withMessage("State is too long."),
  body("addresses.*.pincode").optional({ values: "falsy" }).trim().matches(/^[1-9][0-9]{5}$/).withMessage("Pincode must be a valid 6 digit Indian pincode."),
];
