import { api } from "./api";

export const UserService = {
  async getUsers(params = {}) {
    const response = await api.get("/users", { params });
    return response.data;
  },

  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data.data.user;
  },

  async updateUserStatus(id, status) {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data.data.user;
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async getAddresses() {
    const response = await api.get("/users/me/addresses");
    return response.data.data.addresses;
  },

  async addAddress(payload) {
    const response = await api.post("/users/me/addresses", payload);
    return response.data.data.addresses;
  },

  async updateAddress(addressId, payload) {
    const response = await api.put(`/users/me/addresses/${addressId}`, payload);
    return response.data.data.addresses;
  },

  async deleteAddress(addressId) {
    const response = await api.delete(`/users/me/addresses/${addressId}`);
    return response.data.data.addresses;
  },
};
