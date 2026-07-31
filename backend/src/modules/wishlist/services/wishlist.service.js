import mongoose from "mongoose";
import { Product } from "../../../models/Product.model.js";
import { Wishlist } from "../../../models/Wishlist.model.js";
import { ApiError } from "../../../utils/apiError.js";

export const WishlistService = {
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    return (wishlist.products || []).map((prod) => ({
      id: prod.slug || prod._id.toString(),
      _id: prod._id.toString(),
      name: prod.name,
      slug: prod.slug,
      price: prod.price,
      oldPrice: prod.oldPrice,
      discount: prod.discount,
      badge: prod.badge,
      image: prod.image || prod.images?.[0] || "",
      category: prod.categorySlug || "all",
      stock: prod.stock,
      rating: prod.rating,
    }));
  },

  async toggleWishlist(userId, productIdOrSlug) {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(productIdOrSlug)) {
      product = await Product.findById(productIdOrSlug);
    } else {
      product = await Product.findOne({ slug: productIdOrSlug.toLowerCase() });
    }

    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [product._id] });
    } else {
      const exists = wishlist.products.some(
        (id) => id.toString() === product._id.toString()
      );
      if (exists) {
        wishlist.products.pull(product._id);
      } else {
        wishlist.products.push(product._id);
      }
      await wishlist.save();
    }

    return this.getWishlist(userId);
  },

  async removeFromWishlist(userId, productIdOrSlug) {
    let product = null;
    if (mongoose.Types.ObjectId.isValid(productIdOrSlug)) {
      product = await Product.findById(productIdOrSlug);
    } else {
      product = await Product.findOne({ slug: productIdOrSlug.toLowerCase() });
    }

    if (product) {
      await Wishlist.updateOne({ user: userId }, { $pull: { products: product._id } });
    }

    return this.getWishlist(userId);
  },
};
