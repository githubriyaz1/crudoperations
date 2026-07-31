import { api } from "./api";

export const ReviewService = {
  async getProductReviews(productId) {
    const response = await api.get(`/reviews/products/${productId}/reviews`);
    return response.data.data.reviews;
  },

  async addReview(productId, payload) {
    const response = await api.post(`/reviews/products/${productId}/reviews`, payload);
    return response.data.data.review;
  },

  async getAllReviews(params = {}) {
    const response = await api.get("/reviews", { params });
    return response.data.data.reviews;
  },

  async toggleApproval(id) {
    const response = await api.patch(`/reviews/${id}/approval`);
    return response.data.data.review;
  },

  async deleteReview(id) {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};
