import { asyncHandler } from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/response.js";
import { WishlistService } from "../services/wishlist.service.js";

export const WishlistController = {
  getWishlist: asyncHandler(async (req, res) => {
    const items = await WishlistService.getWishlist(req.user.id);
    return sendSuccess(res, { message: "Wishlist fetched.", data: { wishlist: items } });
  }),

  toggleWishlist: asyncHandler(async (req, res) => {
    const items = await WishlistService.toggleWishlist(req.user.id, req.params.productId);
    return sendSuccess(res, { message: "Wishlist updated.", data: { wishlist: items } });
  }),

  removeFromWishlist: asyncHandler(async (req, res) => {
    const items = await WishlistService.removeFromWishlist(req.user.id, req.params.productId);
    return sendSuccess(res, { message: "Item removed from wishlist.", data: { wishlist: items } });
  }),
};
