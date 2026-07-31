import { Cart } from "../../../models/Cart.model.js";
import { Coupon } from "../../../models/Coupon.model.js";
import { Order } from "../../../models/Order.model.js";
import { Product } from "../../../models/Product.model.js";
import { ApiError } from "../../../utils/apiError.js";

function formatOrder(order) {
  const obj = order.toObject ? order.toObject() : order;
  return {
    id: obj.orderNumber || obj._id.toString(),
    _id: obj._id.toString(),
    orderNumber: obj.orderNumber,
    customerName: obj.customerName,
    email: obj.email,
    phone: obj.phone,
    shippingAddress: obj.shippingAddress,
    paymentMethod: obj.paymentMethod,
    paymentStatus: obj.paymentStatus,
    status: obj.status,
    items: obj.items || [],
    subtotal: obj.subtotal,
    shipping: obj.shipping,
    discount: obj.discount,
    couponCode: obj.couponCode,
    gst: obj.gst,
    total: obj.total,
    createdAt: obj.createdAt,
    date: obj.createdAt ? new Date(obj.createdAt).toISOString().slice(0, 10) : "",
  };
}

export const OrderService = {
  async createOrder(payload, user = null, sessionId = null) {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod = "COD",
      couponCode = "",
      items = [],
    } = payload;

    if (!email || !address) {
      throw new ApiError(400, "Customer email and shipping address are required.");
    }

    let orderItems = [];
    let subtotal = 0;

    if (items.length > 0) {
      for (const item of items) {
        let product = null;
        if (item.productId) {
          product = await Product.findById(item.productId);
        } else if (item.productSlug) {
          product = await Product.findOne({ slug: item.productSlug });
        }

        const price = Number(item.price || product?.price || 0);
        const qty = Number(item.quantity || 1);
        subtotal += price * qty;

        orderItems.push({
          product: product ? product._id : null,
          name: item.name || product?.name || "Product",
          price,
          quantity: qty,
          image: item.image || product?.image || "",
          bundleMetadata: item.bundleMetadata || null,
        });
      }
    } else {
      // Pull items from user's active cart
      const cartQuery = user ? { user: user.id } : sessionId ? { sessionId } : null;
      if (cartQuery) {
        const cart = await Cart.findOne(cartQuery).populate("items.product");
        if (cart && cart.items.length > 0) {
          for (const item of cart.items) {
            if (item.product) {
              const price = item.product.price || 0;
              const qty = item.quantity || 1;
              subtotal += price * qty;
              orderItems.push({
                product: item.product._id,
                name: item.product.name,
                price,
                quantity: qty,
                image: item.product.image || item.product.images?.[0] || "",
                bundleMetadata: item.bundleMetadata || null,
              });
            }
          }
          await Cart.updateOne(cartQuery, { $set: { items: [] } });
        }
      }
    }

    if (orderItems.length === 0) {
      throw new ApiError(400, "Cannot create an empty order.");
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
      if (coupon) {
        if (coupon.discountPercent > 0) {
          discount = (subtotal * coupon.discountPercent) / 100;
          if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else if (coupon.discountAmount > 0) {
          discount = coupon.discountAmount;
        }
        await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } });
      }
    }

    const shippingThreshold = 999;
    const shippingCharge = 99;
    const shipping = subtotal > 0 && subtotal < shippingThreshold ? shippingCharge : 0;
    const gst = Math.round((subtotal - discount) * 0.03); // 3% GST
    const total = Math.max(0, subtotal - discount + shipping + gst);

    const orderNumber = `LB-${Date.now().toString().slice(-6)}`;

    const order = await Order.create({
      orderNumber,
      user: user ? user.id : null,
      customerName: name || user?.name || "Customer",
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || user?.phone || "",
      shippingAddress: {
        address: typeof address === "string" ? address : address.address || "",
        city: city || address.city || "",
        state: state || address.state || "",
        pincode: pincode || address.pincode || "",
      },
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      status: "Processing",
      items: orderItems,
      subtotal,
      shipping,
      discount,
      couponCode: couponCode ? couponCode.toUpperCase().trim() : "",
      gst,
      total,
    });

    return formatOrder(order);
  },

  async getMyOrders(userId, email = "") {
    const filter = {};
    if (userId) {
      filter.$or = [{ user: userId }, { email: email.toLowerCase() }];
    } else if (email) {
      filter.email = email.toLowerCase();
    } else {
      return [];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return orders.map(formatOrder);
  },

  async getOrderById(idOrNumber) {
    let order = null;
    if (idOrNumber.startsWith("LB-")) {
      order = await Order.findOne({ orderNumber: idOrNumber });
    } else {
      order = await Order.findById(idOrNumber);
    }

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }
    return formatOrder(order);
  },

  async getAllOrders({ page = 1, limit = 50, search = "", status = "" } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(200, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ orderNumber: regex }, { customerName: regex }, { email: regex }];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    return {
      items: orders.map(formatOrder),
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  },

  async updateOrderStatus(id, status) {
    let order = null;
    if (id.startsWith("LB-")) {
      order = await Order.findOne({ orderNumber: id });
    } else {
      order = await Order.findById(id);
    }

    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    order.status = status;
    if (status === "Delivered") {
      order.paymentStatus = "Paid";
    }
    await order.save();
    return formatOrder(order);
  },
};
