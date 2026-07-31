import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendCreated, sendSuccess } from "../../../utils/response.js";
import { CouponService } from "../services/coupon.service.js";

export const CouponController = {
  getCoupons: asyncHandler(async (_req, res) => {
    const coupons = await CouponService.getCoupons();
    return sendSuccess(res, { message: "Coupons fetched.", data: { coupons } });
  }),

  validateCoupon: asyncHandler(async (req, res) => {
    const result = await CouponService.validateCoupon(req.body.code, req.body.cartSubtotal);
    return sendSuccess(res, { message: "Coupon validated.", data: result });
  }),

  createCoupon: asyncHandler(async (req, res) => {
    const coupon = await CouponService.createCoupon(req.body);
    return sendCreated(res, { message: "Coupon created.", data: { coupon } });
  }),

  updateCoupon: asyncHandler(async (req, res) => {
    const coupon = await CouponService.updateCoupon(req.params.id, req.body);
    return sendSuccess(res, { message: "Coupon updated.", data: { coupon } });
  }),

  toggleCoupon: asyncHandler(async (req, res) => {
    const coupon = await CouponService.toggleCoupon(req.params.id);
    return sendSuccess(res, { message: "Coupon status toggled.", data: { coupon } });
  }),

  deleteCoupon: asyncHandler(async (req, res) => {
    await CouponService.deleteCoupon(req.params.id);
    return sendSuccess(res, { message: "Coupon deleted.", data: null });
  }),
};
