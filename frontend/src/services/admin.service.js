import { api } from "./api";

export const AdminService = {
  async getDashboardSummary() {
    const response = await api.get("/admin/dashboard");
    return response.data.data;
  },

  async getAnalytics() {
    const response = await api.get("/admin/analytics");
    return response.data.data;
  },
};
