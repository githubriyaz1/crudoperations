import { api } from "./api";

export const CategoryService = {
  async getCategories(params = {}) {
    const response = await api.get("/categories", { params });
    return response.data.data.categories;
  },

  async getCategoryBySlug(slug) {
    const response = await api.get(`/categories/${slug}`);
    return response.data.data.category;
  },

  async createCategory(payload) {
    const response = await api.post("/categories", payload);
    return response.data.data.category;
  },

  async updateCategory(id, payload) {
    const response = await api.put(`/categories/${id}`, payload);
    return response.data.data.category;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
