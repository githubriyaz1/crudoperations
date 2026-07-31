import { api } from "./api";

export const CartService = {
  async getCart() {
    const response = await api.get("/cart");
    return response.data.data.cart;
  },

  async addItem(productId, quantity = 1, bundleMetadata = null) {
    const response = await api.post("/cart/items", { productId, quantity, bundleMetadata });
    return response.data.data.cart;
  },

  async updateQuantity(productId, quantity) {
    const response = await api.patch(`/cart/items/${productId}`, { quantity });
    return response.data.data.cart;
  },

  async removeItem(productId) {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data.data.cart;
  },

  async clearCart() {
    const response = await api.delete("/cart");
    return response.data.data.cart;
  },
};
