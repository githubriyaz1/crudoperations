import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/response.js";
import { CartService } from "../services/cart.service.js";

function getIdentifiers(req) {
  const userId = req.user ? req.user.id : null;
  const sessionId = req.headers["x-session-id"] || req.cookies?.l2b_session_id || "guest-session";
  return { userId, sessionId };
}

export const CartController = {
  getCart: asyncHandler(async (req, res) => {
    const { userId, sessionId } = getIdentifiers(req);
    const cart = await CartService.getCart(userId, sessionId);
    return sendSuccess(res, { message: "Cart fetched.", data: { cart } });
  }),

  addItem: asyncHandler(async (req, res) => {
    const { userId, sessionId } = getIdentifiers(req);
    const cart = await CartService.addItem(userId, sessionId, req.body);
    return sendSuccess(res, { message: "Item added to cart.", data: { cart } });
  }),

  updateItemQuantity: asyncHandler(async (req, res) => {
    const { userId, sessionId } = getIdentifiers(req);
    const cart = await CartService.updateItemQuantity(
      userId,
      sessionId,
      req.params.productId,
      req.body.quantity
    );
    return sendSuccess(res, { message: "Cart quantity updated.", data: { cart } });
  }),

  removeItem: asyncHandler(async (req, res) => {
    const { userId, sessionId } = getIdentifiers(req);
    const cart = await CartService.removeItem(userId, sessionId, req.params.productId);
    return sendSuccess(res, { message: "Item removed from cart.", data: { cart } });
  }),

  clearCart: asyncHandler(async (req, res) => {
    const { userId, sessionId } = getIdentifiers(req);
    const cart = await CartService.clearCart(userId, sessionId);
    return sendSuccess(res, { message: "Cart cleared.", data: { cart } });
  }),
};
