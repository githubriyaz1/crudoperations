import { api } from "./api";

export const OrderService = {
  async checkout(payload) {
    const response = await api.post("/orders/checkout", payload);
    return response.data.data.order;
  },

  async getMyOrders(email = "") {
    const response = await api.get("/orders/my", { params: { email } });
    return response.data.data.orders;
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data.data.order;
  },

  async getAllOrders(params = {}) {
    const response = await api.get("/orders", { params });
    return response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data.data.order;
  },
};
