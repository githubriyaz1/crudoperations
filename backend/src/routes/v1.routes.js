import { Router } from "express";
import adminRoutes from "../modules/admin/routes/admin.routes.js";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import cartRoutes from "../modules/cart/routes/cart.routes.js";
import categoryRoutes from "../modules/categories/routes/category.routes.js";
import contactRoutes from "../modules/contact/routes/contact.routes.js";
import couponRoutes from "../modules/coupons/routes/coupon.routes.js";
import newsletterRoutes from "../modules/newsletter/routes/newsletter.routes.js";
import orderRoutes from "../modules/orders/routes/order.routes.js";
import productRoutes from "../modules/products/routes/product.routes.js";
import reviewRoutes from "../modules/reviews/routes/review.routes.js";
import searchRoutes from "../modules/search/routes/search.routes.js";
import settingsRoutes from "../modules/settings/routes/settings.routes.js";
import uploadRoutes from "../modules/upload/routes/upload.routes.js";
import userRoutes from "../modules/users/routes/user.routes.js";
import wishlistRoutes from "../modules/wishlist/routes/wishlist.routes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Love2Bazzar API v1",
    data: { version: "v1" },
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/upload", uploadRoutes);
router.use("/search", searchRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/cart", cartRoutes);
router.use("/coupons", couponRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admin", adminRoutes);
router.use("/contact", contactRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/settings", settingsRoutes);

export default router;
