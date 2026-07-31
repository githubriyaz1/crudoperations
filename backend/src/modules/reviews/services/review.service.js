import mongoose from "mongoose";
import { Product } from "../../../models/Product.model.js";
import { Review } from "../../../models/Review.model.js";
import { ApiError } from "../../../utils/apiError.js";

function formatReview(review) {
  return {
    id: review._id.toString(),
    _id: review._id.toString(),
    productId: review.product?._id?.toString() || review.product?.toString(),
    productName: review.product?.name || "",
    name: review.name,
    rating: review.rating,
    text: review.text,
    approved: review.approved,
    createdAt: review.createdAt ? new Date(review.createdAt).toISOString().slice(0, 10) : "",
  };
}

export const ReviewService = {
  async getProductReviews(productIdOrSlug) {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(productIdOrSlug)) {
      product = await Product.findById(productIdOrSlug);
    } else {
      product = await Product.findOne({ slug: productIdOrSlug.toLowerCase() });
    }

    if (!product) return [];
    const reviews = await Review.find({ product: product._id, approved: true }).sort({ createdAt: -1 });
    return reviews.map(formatReview);
  },

  async addReview(productIdOrSlug, payload, user = null) {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(productIdOrSlug)) {
      product = await Product.findById(productIdOrSlug);
    } else {
      product = await Product.findOne({ slug: productIdOrSlug.toLowerCase() });
    }

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    const review = await Review.create({
      product: product._id,
      user: user ? user.id : null,
      name: payload.name || user?.name || "Customer",
      rating: Number(payload.rating || 5),
      text: payload.text.trim(),
      approved: false, // Moderation required
    });

    return formatReview(review);
  },

  async getAllReviews({ approved } = {}) {
    const filter = {};
    if (approved !== undefined) filter.approved = approved === "true" || approved === true;

    const reviews = await Review.find(filter).populate("product", "name slug").sort({ createdAt: -1 });
    return reviews.map(formatReview);
  },

  async toggleReviewApproval(id) {
    const review = await Review.findById(id);
    if (!review) {
      throw new ApiError(404, "Review not found.");
    }
    review.approved = !review.approved;
    await review.save();

    // Recalculate product rating
    const approvedReviews = await Review.find({ product: review.product, approved: true });
    if (approvedReviews.length > 0) {
      const avg = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
      await Product.updateOne(
        { _id: review.product },
        { rating: Number(avg.toFixed(1)), reviewsCount: approvedReviews.length }
      );
    }

    return formatReview(review);
  },

  async deleteReview(id) {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      throw new ApiError(404, "Review not found.");
    }
    return true;
  },
};
