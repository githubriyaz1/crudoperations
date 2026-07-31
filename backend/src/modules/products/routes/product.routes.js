import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { ProductController } from "../controllers/product.controller.js";
import { validateCreateProduct, validateUpdateProduct } from "../validators/product.validators.js";

const router = Router();

// Public product routes
router.get("/", ProductController.getProducts);
router.get("/:idOrSlug", ProductController.getProductByIdOrSlug);

// Admin-only product management routes
router.post("/", authenticate, requireAdmin, validateCreateProduct, ProductController.createProduct);
router.put("/:id", authenticate, requireAdmin, validateUpdateProduct, ProductController.updateProduct);
router.patch("/:id", authenticate, requireAdmin, validateUpdateProduct, ProductController.updateProduct);
router.patch("/:id/visibility", authenticate, requireAdmin, ProductController.toggleProductVisibility);
router.delete("/:id", authenticate, requireAdmin, ProductController.deleteProduct);

export default router;
