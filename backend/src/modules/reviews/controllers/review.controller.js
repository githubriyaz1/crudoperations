import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendCreated, sendSuccess } from "../../../utils/response.js";
import { ReviewService } from "../services/review.service.js";

export const ReviewController = {
  getProductReviews: asyncHandler(async (req, res) => {
    const reviews = await ReviewService.getProductReviews(req.params.productId);
    return sendSuccess(res, { message: "Reviews fetched.", data: { reviews } });
  }),

  addReview: asyncHandler(async (req, res) => {
    const review = await ReviewService.addReview(req.params.productId, req.body, req.user || null);
    return sendCreated(res, {
      message: "Review submitted successfully and is pending approval.",
      data: { review },
    });
  }),

  getAllReviews: asyncHandler(async (req, res) => {
    const reviews = await ReviewService.getAllReviews(req.query);
    return sendSuccess(res, { message: "All reviews fetched.", data: { reviews } });
  }),

  toggleReviewApproval: asyncHandler(async (req, res) => {
    const review = await ReviewService.toggleReviewApproval(req.params.id);
    return sendSuccess(res, { message: "Review approval status updated.", data: { review } });
  }),

  deleteReview: asyncHandler(async (req, res) => {
    await ReviewService.deleteReview(req.params.id);
    return sendSuccess(res, { message: "Review deleted.", data: null });
  }),
};
