import { Coupon } from "../../../models/Coupon.model.js";
import { ApiError } from "../../../utils/apiError.js";

function formatCoupon(coupon) {
  return {
    id: coupon._id.toString(),
    _id: coupon._id.toString(),
    code: coupon.code,
    discountPercent: coupon.discountPercent || 0,
    discountAmount: coupon.discountAmount || 0,
    minSpend: coupon.minSpend || 0,
    maxDiscount: coupon.maxDiscount || 0,
    isActive: coupon.isActive,
    usageLimit: coupon.usageLimit,
    usedCount: coupon.usedCount,
    expiresAt: coupon.expiresAt,
    createdAt: coupon.createdAt,
  };
}

export const CouponService = {
  async getCoupons() {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return coupons.map(formatCoupon);
  },

  async validateCoupon(code, cartSubtotal = 0) {
    if (!code) throw new ApiError(400, "Coupon code is required.");
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon || !coupon.isActive) {
      throw new ApiError(404, "Invalid or expired coupon code.");
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new ApiError(400, "This coupon code has expired.");
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new ApiError(400, "Coupon usage limit reached.");
    }

    const subtotal = Number(cartSubtotal);
    if (subtotal < coupon.minSpend) {
      throw new ApiError(
        400,
        `Minimum order amount of Rs. ${coupon.minSpend} required for this coupon.`
      );
    }

    let discount = 0;
    if (coupon.discountPercent > 0) {
      discount = (subtotal * coupon.discountPercent) / 100;
      if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountAmount > 0) {
      discount = coupon.discountAmount;
    }

    return {
      valid: true,
      coupon: formatCoupon(coupon),
      discount: Math.min(discount, subtotal),
    };
  },

  async createCoupon(payload) {
    const code = payload.code.toUpperCase().trim();
    const existing = await Coupon.findOne({ code });
    if (existing) {
      throw new ApiError(409, "A coupon with this code already exists.");
    }

    const coupon = await Coupon.create({
      code,
      discountPercent: Number(payload.discountPercent || 0),
      discountAmount: Number(payload.discountAmount || 0),
      minSpend: Number(payload.minSpend || 0),
      maxDiscount: Number(payload.maxDiscount || 0),
      isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
      usageLimit: Number(payload.usageLimit || 100),
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
    });

    return formatCoupon(coupon);
  },

  async updateCoupon(id, payload) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new ApiError(404, "Coupon not found.");
    }

    if (payload.code !== undefined && payload.code.toUpperCase().trim() !== coupon.code) {
      const newCode = payload.code.toUpperCase().trim();
      const existing = await Coupon.findOne({ code: newCode, _id: { $ne: id } });
      if (existing) throw new ApiError(409, "Coupon code already exists.");
      coupon.code = newCode;
    }

    if (payload.discountPercent !== undefined) coupon.discountPercent = Number(payload.discountPercent);
    if (payload.discountAmount !== undefined) coupon.discountAmount = Number(payload.discountAmount);
    if (payload.minSpend !== undefined) coupon.minSpend = Number(payload.minSpend);
    if (payload.maxDiscount !== undefined) coupon.maxDiscount = Number(payload.maxDiscount);
    if (payload.isActive !== undefined) coupon.isActive = Boolean(payload.isActive);
    if (payload.usageLimit !== undefined) coupon.usageLimit = Number(payload.usageLimit);
    if (payload.expiresAt !== undefined) coupon.expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null;

    await coupon.save();
    return formatCoupon(coupon);
  },

  async toggleCoupon(id) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new ApiError(404, "Coupon not found.");
    }
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    return formatCoupon(coupon);
  },

  async deleteCoupon(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      throw new ApiError(404, "Coupon not found.");
    }
    return true;
  },
};
