import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { OrderController } from "../controllers/order.controller.js";

const router = Router();

const optionalAuth = (req, res, next) => {
  const header = req.get("Authorization");
  if (header && header.startsWith("Bearer ")) {
    return authenticate(req, res, next);
  }
  return next();
};

// Customer order routes
router.post("/checkout", optionalAuth, OrderController.createOrder);
router.get("/my", optionalAuth, OrderController.getMyOrders);
router.get("/:id", optionalAuth, OrderController.getOrderById);

// Admin order routes
router.get("/", authenticate, requireAdmin, OrderController.getAllOrders);
router.patch("/:id/status", authenticate, requireAdmin, OrderController.updateOrderStatus);

export default router;
