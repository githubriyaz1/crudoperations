import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    text: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
    },
    approved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, approved: 1 });

export const Review = mongoose.model("Review", reviewSchema);
