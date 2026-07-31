import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { CategoryController } from "../controllers/category.controller.js";
import { validateCreateCategory, validateUpdateCategory } from "../validators/category.validators.js";

const router = Router();

// Public category routes
router.get("/", CategoryController.getCategories);
router.get("/:slug", CategoryController.getCategoryBySlug);

// Admin-only category management routes
router.post("/", authenticate, requireAdmin, validateCreateCategory, CategoryController.createCategory);
router.put("/:id", authenticate, requireAdmin, validateUpdateCategory, CategoryController.updateCategory);
router.patch("/:id", authenticate, requireAdmin, validateUpdateCategory, CategoryController.updateCategory);
router.delete("/:id", authenticate, requireAdmin, CategoryController.deleteCategory);

export default router;
