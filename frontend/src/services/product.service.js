import { api } from "./api";

export const ProductService = {
  async getProducts(params = {}) {
    const response = await api.get("/products", { params });
    return response.data;
  },

  async getProductByIdOrSlug(idOrSlug) {
    const response = await api.get(`/products/${idOrSlug}`);
    return response.data.data.product;
  },

  async createProduct(payload) {
    const response = await api.post("/products", payload);
    return response.data.data.product;
  },

  async updateProduct(id, payload) {
    const response = await api.put(`/products/${id}`, payload);
    return response.data.data.product;
  },

  async toggleVisibility(id) {
    const response = await api.patch(`/products/${id}/visibility`);
    return response.data.data.product;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },
};
