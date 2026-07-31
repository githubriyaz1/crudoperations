import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendCreated, sendPaginated, sendSuccess } from "../../../utils/response.js";
import { OrderService } from "../services/order.service.js";

export const OrderController = {
  createOrder: asyncHandler(async (req, res) => {
    const sessionId = req.headers["x-session-id"] || req.cookies?.l2b_session_id || "guest-session";
    const order = await OrderService.createOrder(req.body, req.user || null, sessionId);
    return sendCreated(res, { message: "Order placed successfully.", data: { order } });
  }),

  getMyOrders: asyncHandler(async (req, res) => {
    const orders = await OrderService.getMyOrders(req.user ? req.user.id : null, req.user ? req.user.email : req.query.email);
    return sendSuccess(res, { message: "My orders fetched.", data: { orders } });
  }),

  getOrderById: asyncHandler(async (req, res) => {
    const order = await OrderService.getOrderById(req.params.id);
    return sendSuccess(res, { message: "Order details fetched.", data: { order } });
  }),

  getAllOrders: asyncHandler(async (req, res) => {
    const result = await OrderService.getAllOrders(req.query);
    return sendPaginated(res, {
      message: "Admin orders fetched.",
      data: result.items,
      meta: result.meta,
    });
  }),

  updateOrderStatus: asyncHandler(async (req, res) => {
    const order = await OrderService.updateOrderStatus(req.params.id, req.body.status);
    return sendSuccess(res, { message: "Order status updated.", data: { order } });
  }),
};
