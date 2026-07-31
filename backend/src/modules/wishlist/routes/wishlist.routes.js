import { Router } from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import { WishlistController } from "../controllers/wishlist.controller.js";

const router = Router();

router.get("/", authenticate, WishlistController.getWishlist);
router.post("/:productId", authenticate, WishlistController.toggleWishlist);
router.delete("/:productId", authenticate, WishlistController.removeFromWishlist);

export default router;
