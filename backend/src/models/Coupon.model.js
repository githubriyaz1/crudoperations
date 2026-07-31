import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    discountAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    minSpend: {
      type: Number,
      min: 0,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
