import { api } from "./api";

export const ContactService = {
  async submitInquiry(payload) {
    const response = await api.post("/contact", payload);
    return response.data;
  },

  async getInquiries(params = {}) {
    const response = await api.get("/contact", { params });
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/contact/${id}/status`, { status });
    return response.data.data.inquiry;
  },
};
