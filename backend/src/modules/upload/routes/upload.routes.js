import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { UploadController } from "../controllers/upload.controller.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/", authenticate, requireAdmin, uploadSingleImage, UploadController.uploadImage);

export default router;
