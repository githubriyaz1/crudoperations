import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { ReviewController } from "../controllers/review.controller.js";

const router = Router();

const optionalAuth = (req, res, next) => {
  const header = req.get("Authorization");
  if (header && header.startsWith("Bearer ")) {
    return authenticate(req, res, next);
  }
  return next();
};

// Customer routes
router.get("/products/:productId/reviews", ReviewController.getProductReviews);
router.post("/products/:productId/reviews", optionalAuth, ReviewController.addReview);

// Admin moderation routes
router.get("/", authenticate, requireAdmin, ReviewController.getAllReviews);
router.patch("/:id/approval", authenticate, requireAdmin, ReviewController.toggleReviewApproval);
router.delete("/:id", authenticate, requireAdmin, ReviewController.deleteReview);

export default router;
