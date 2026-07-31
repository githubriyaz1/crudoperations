import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { SettingsController } from "../controllers/settings.controller.js";

const router = Router();

router.get("/", SettingsController.getSettings);
router.patch("/", authenticate, requireAdmin, SettingsController.updateSettings);

export default router;
