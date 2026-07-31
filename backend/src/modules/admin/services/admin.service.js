import { Coupon } from "../../../models/Coupon.model.js";
import { Order } from "../../../models/Order.model.js";
import { Product } from "../../../models/Product.model.js";
import { User } from "../../../models/User.model.js";

export const AdminService = {
  async getDashboardSummary() {
    const [totalOrders, totalUsers, totalProducts, ordersList] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Product.countDocuments({ hidden: false }),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const allOrders = await Order.find({ paymentStatus: "Paid" }).select("total");
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const recentOrders = ordersList.map((o) => ({
      id: o.orderNumber || o._id.toString(),
      customer: o.customerName,
      itemsCount: o.items.length,
      total: o.total,
      status: o.status,
      date: o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : "",
    }));

    return {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders,
    };
  },

  async getAnalytics() {
    const [orders, products, coupons] = await Promise.all([
      Order.find().select("total status createdAt items couponCode"),
      Product.find().select("name stock price hidden"),
      Coupon.find().select("code usedCount"),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const lowStockProducts = products
      .filter((p) => (p.stock || 0) < 10)
      .map((p) => ({ id: p._id.toString(), name: p.name, stock: p.stock, price: p.price }));

    const pipeline = {
      pending: orders.filter((o) => o.status === "Pending").length,
      processing: orders.filter((o) => o.status === "Processing").length,
      shipped: orders.filter((o) => o.status === "Shipped").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
    };

    const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalRedemptions,
      pipeline,
      lowStockProducts,
    };
  },
};
