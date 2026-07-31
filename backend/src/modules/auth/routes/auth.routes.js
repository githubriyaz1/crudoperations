import { Router } from "express";
import { validateRequest } from "../../../middlewares/error.middleware.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import { authLimiter } from "../../../middlewares/rateLimiter.middleware.js";
import { AuthController } from "../controllers/auth.controller.js";
import {
  loginValidator,
  refreshValidator,
  registerValidator,
  updateMeValidator,
} from "../validators/auth.validators.js";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a customer account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Love2Bazzar Customer }
 *               email: { type: string, example: customer@love2bazzar.com }
 *               phone: { type: string, example: "9876543210" }
 *               password: { type: string, example: StrongPass123 }
 *     responses:
 *       201:
 *         description: Account created
 */
router.post("/register", authLimiter, registerValidator, validateRequest, AuthController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user or admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: customer@love2bazzar.com }
 *               password: { type: string, example: StrongPass123 }
 *     responses:
 *       200:
 *         description: Logged in
 */
router.post("/login", authLimiter, loginValidator, validateRequest, AuthController.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post("/refresh", authLimiter, refreshValidator, validateRequest, AuthController.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout current session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post("/logout", AuthController.logout);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched
 */
router.get("/me", authenticate, AuthController.me);

/**
 * @openapi
 * /auth/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch("/me", authenticate, updateMeValidator, validateRequest, AuthController.updateMe);

export default router;
