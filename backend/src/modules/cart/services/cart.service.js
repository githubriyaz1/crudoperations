import mongoose from "mongoose";
import { Cart } from "../../../models/Cart.model.js";
import { Product } from "../../../models/Product.model.js";
import { ApiError } from "../../../utils/apiError.js";

async function findProduct(productId) {
  if (!productId) return null;
  const strId = String(productId).trim();

  let product = null;
  if (mongoose.Types.ObjectId.isValid(strId) && strId.length === 24) {
    product = await Product.findById(strId);
  }
  if (!product && !isNaN(Number(strId))) {
    product = await Product.findOne({ legacyId: Number(strId) });
  }
  if (!product) {
    product = await Product.findOne({ slug: strId.toLowerCase() });
  }
  return product;
}

function getCartQuery(userId, sessionId) {
  if (userId) return { user: userId };
  if (sessionId) return { sessionId };
  return { sessionId: "guest-session" };
}

export const CartService = {
  async getCart(userId, sessionId) {
    const query = getCartQuery(userId, sessionId);

    let cart = await Cart.findOne(query).populate("items.product");
    if (!cart) {
      cart = await Cart.create({ ...query, items: [] });
    }

    let subtotal = 0;
    const formattedItems = (cart.items || [])
      .filter((item) => item.product)
      .map((item) => {
        const prod = item.product;
        const price = prod.price || 0;
        const lineTotal = price * item.quantity;
        subtotal += lineTotal;

        return {
          id: item._id.toString(),
          _id: item._id.toString(),
          productId: prod._id.toString(),
          productSlug: prod.slug,
          name: prod.name,
          price: prod.price,
          oldPrice: prod.oldPrice || prod.price,
          image: prod.image || prod.images?.[0] || "",
          quantity: item.quantity,
          bundleMetadata: item.bundleMetadata || null,
        };
      });

    const shippingThreshold = 999;
    const shippingCharge = 99;
    const shipping = subtotal > 0 && subtotal < shippingThreshold ? shippingCharge : 0;
    const total = subtotal + shipping;

    return {
      items: formattedItems,
      subtotal,
      shipping,
      total,
    };
  },

  async addItem(userId, sessionId, { productId, quantity = 1, bundleMetadata = null }) {
    const product = await findProduct(productId);
    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    const query = getCartQuery(userId, sessionId);
    let cart = await Cart.findOne(query);
    if (!cart) {
      cart = await Cart.create({ ...query, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product && item.product.toString() === product._id.toString()
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
      if (bundleMetadata) {
        cart.items[existingIndex].bundleMetadata = bundleMetadata;
      }
    } else {
      cart.items.push({
        product: product._id,
        quantity: Number(quantity),
        bundleMetadata,
      });
    }

    await cart.save();
    return this.getCart(userId, sessionId);
  },

  async updateItemQuantity(userId, sessionId, productId, quantity) {
    const query = getCartQuery(userId, sessionId);
    const cart = await Cart.findOne(query);
    if (!cart) throw new ApiError(404, "Cart not found.");

    const product = await findProduct(productId);

    const item = cart.items.find(
      (i) =>
        i._id.toString() === String(productId) ||
        (product && i.product && i.product.toString() === product._id.toString())
    );

    if (!item) {
      throw new ApiError(404, "Cart item not found.");
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      cart.items.pull({ _id: item._id });
    } else {
      item.quantity = qty;
    }

    await cart.save();
    return this.getCart(userId, sessionId);
  },

  async removeItem(userId, sessionId, productId) {
    const query = getCartQuery(userId, sessionId);
    const cart = await Cart.findOne(query);
    if (cart) {
      const product = await findProduct(productId);

      cart.items = cart.items.filter(
        (i) =>
          i._id.toString() !== String(productId) &&
          (!product || (i.product && i.product.toString() !== product._id.toString()))
      );
      await cart.save();
    }

    return this.getCart(userId, sessionId);
  },

  async clearCart(userId, sessionId) {
    const query = getCartQuery(userId, sessionId);
    if (query) {
      await Cart.updateOne(query, { $set: { items: [] } });
    }
    return { items: [], subtotal: 0, shipping: 0, total: 0 };
  },
};
