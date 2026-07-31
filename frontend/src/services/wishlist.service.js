import { api } from "./api";

export const WishlistService = {
  async getWishlist() {
    const response = await api.get("/wishlist");
    return response.data.data.wishlist;
  },

  async toggleWishlist(productId) {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data.data.wishlist;
  },

  async removeFromWishlist(productId) {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data.data.wishlist;
  },
};
