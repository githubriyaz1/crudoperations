import { Router } from "express";
import { authenticate, requireAdmin } from "../../../middlewares/auth.middleware.js";
import { UserController } from "../controllers/user.controller.js";
import { validateAddress, validateUpdateStatus } from "../validators/user.validators.js";

const router = Router();

// Authenticated user address routes
router.get("/me/addresses", authenticate, UserController.getUserAddresses);
router.post("/me/addresses", authenticate, validateAddress, UserController.addAddress);
router.put("/me/addresses/:addressId", authenticate, validateAddress, UserController.updateAddress);
router.delete("/me/addresses/:addressId", authenticate, UserController.deleteAddress);

// Admin-only user management routes
router.get("/", authenticate, requireAdmin, UserController.getUsers);
router.get("/:id", authenticate, requireAdmin, UserController.getUserById);
router.patch("/:id/status", authenticate, requireAdmin, validateUpdateStatus, UserController.updateUserStatus);
router.delete("/:id", authenticate, requireAdmin, UserController.deleteUser);

export default router;
