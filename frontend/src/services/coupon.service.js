import { api } from "./api";

export const CouponService = {
  async getCoupons() {
    const response = await api.get("/coupons");
    return response.data.data.coupons;
  },

  async validateCoupon(code, cartSubtotal = 0) {
    const response = await api.post("/coupons/validate", { code, cartSubtotal });
    return response.data.data;
  },

  async createCoupon(payload) {
    const response = await api.post("/coupons", payload);
    return response.data.data.coupon;
  },

  async updateCoupon(id, payload) {
    const response = await api.put(`/coupons/${id}`, payload);
    return response.data.data.coupon;
  },

  async toggleCoupon(id) {
    const response = await api.patch(`/coupons/${id}/toggle`);
    return response.data.data.coupon;
  },

  async deleteCoupon(id) {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  },
};
