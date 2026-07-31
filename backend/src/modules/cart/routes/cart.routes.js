import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import { CartController } from "../controllers/cart.controller.js";

const router = Router();

const optionalAuth = (req, res, next) => {
  const header = req.get("Authorization");
  if (header && header.startsWith("Bearer ")) {
    return authenticate(req, res, next);
  }
  return next();
};

router.get("/", optionalAuth, CartController.getCart);
router.post("/items", optionalAuth, CartController.addItem);
router.patch("/items/:productId", optionalAuth, CartController.updateItemQuantity);
router.delete("/items/:productId", optionalAuth, CartController.removeItem);
router.delete("/", optionalAuth, CartController.clearCart);

export default router;
