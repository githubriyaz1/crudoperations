import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { ContactController } from "../controllers/contact.controller.js";

const router = Router();

router.post("/", ContactController.submitInquiry);
router.get("/", authenticate, requireAdmin, ContactController.getInquiries);
router.patch("/:id/status", authenticate, requireAdmin, ContactController.updateStatus);

export default router;
