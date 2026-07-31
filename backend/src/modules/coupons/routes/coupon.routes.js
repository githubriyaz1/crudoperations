import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { CouponController } from "../controllers/coupon.controller.js";

const router = Router();

// Public / customer coupon validation
router.post("/validate", CouponController.validateCoupon);

// Admin-only coupon management
router.get("/", authenticate, requireAdmin, CouponController.getCoupons);
router.post("/", authenticate, requireAdmin, CouponController.createCoupon);
router.put("/:id", authenticate, requireAdmin, CouponController.updateCoupon);
router.patch("/:id/toggle", authenticate, requireAdmin, CouponController.toggleCoupon);
router.delete("/:id", authenticate, requireAdmin, CouponController.deleteCoupon);

export default router;
