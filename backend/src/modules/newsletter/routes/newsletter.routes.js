import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { NewsletterController } from "../controllers/newsletter.controller.js";

const router = Router();

router.post("/subscribe", NewsletterController.subscribe);
router.get("/subscribers", authenticate, requireAdmin, NewsletterController.getSubscribers);

export default router;
