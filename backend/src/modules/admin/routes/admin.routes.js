import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { AdminController } from "../controllers/admin.controller.js";

const router = Router();

router.get("/dashboard", authenticate, requireAdmin, AdminController.getDashboardSummary);
router.get("/analytics", authenticate, requireAdmin, AdminController.getAnalytics);

export default router;
