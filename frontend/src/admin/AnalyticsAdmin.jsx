import { useEffect, useState } from "react";
import { FaBoxOpen, FaChartLine, FaRupeeSign, FaShoppingBag } from "react-icons/fa";
import { AdminHeader } from "./AdminOverview";
import { useOrders } from "../context/OrdersContext";
import { useProducts } from "../context/ProductContext";
import { useCoupons } from "../context/CouponContext";
import { AdminService } from "../services/admin.service";

function AnalyticsAdmin() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { coupons } = useCoupons();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchAnalytics = async () => {
      try {
        const data = await AdminService.getAnalytics();
        if (active && data) setAnalytics(data);
      } catch {
        // Fallback
      }
    };
    fetchAnalytics();
    return () => {
      active = false;
    };
  }, []);

  const revenue = analytics?.totalRevenue ?? orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const averageOrder = analytics?.averageOrderValue ?? (orders.length ? Math.round(revenue / orders.length) : 0);
  const usedCoupons = analytics?.totalRedemptions ?? coupons.reduce((sum, coupon) => sum + (coupon.usageCount || 0), 0);
  const lowStockCount = analytics?.lowStockProducts?.length ?? products.filter((product) => Number(product.stock) <= 5).length;

  const statusGroups = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => ({
    status,
    count: analytics?.pipeline?.[status.toLowerCase()] ?? orders.filter((order) => order.status === status).length,
  }));
  const maxStatusCount = Math.max(...statusGroups.map((group) => group.count), 1);
  const recentOrders = [...orders].slice(0, 7).reverse();
  const maxOrderValue = Math.max(...recentOrders.map((order) => Number(order.total || 0)), 1);

  return (
    <div>
      <AdminHeader title="Analytics" subtitle="A live snapshot built from the orders, products, and coupons in your store." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<FaRupeeSign />} label="Gross sales" value={`Rs. ${revenue.toLocaleString("en-IN")}`} />
        <Metric icon={<FaShoppingBag />} label="Average order" value={`Rs. ${averageOrder.toLocaleString("en-IN")}`} />
        <Metric icon={<FaBoxOpen />} label="Visible products" value={products.filter((product) => !product.hidden).length} />
        <Metric icon={<FaChartLine />} label="Coupon redemptions" value={usedCoupons} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="admin-card">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="admin-title">Recent order value</h2>
            <p className="text-xs text-[#cfc1a5]">Latest {recentOrders.length || 0} orders</p>
          </div>
          {recentOrders.length ? (
            <div className="mt-8 flex h-60 items-end gap-2 sm:gap-4">
              {recentOrders.map((order) => (
                <div key={order.id || order._id} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <p className="hidden text-xs text-[#f8dfa0] sm:block">{Math.round((order.total || 0) / 1000)}k</p>
                  <div className="relative w-full rounded-t-lg bg-gradient-to-t from-[#a87310] to-[#e8c654]" style={{ height: `${Math.max(((order.total || 0) / maxOrderValue) * 100, 8)}%` }}>
                    <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#fff3c6]" />
                  </div>
                  <p className="truncate text-[10px] text-[#cfc1a5] sm:text-xs">{(order.id || order.orderNumber || "").replace("L2B-", "#")}</p>
                </div>
              ))}
            </div>
          ) : <EmptyState text="Orders will appear here after customers checkout." />}
        </div>

        <div className="admin-card">
          <h2 className="admin-title">Order pipeline</h2>
          <div className="mt-7 grid gap-5">
            {statusGroups.map((group) => (
              <div key={group.status}>
                <div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-[#f8efd9]">{group.status}</span><span className="text-[#d4af37]">{group.count}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-[#d4af37]" style={{ width: `${(group.count / maxStatusCount) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-card mt-6">
        <h2 className="admin-title">Quick store health</h2>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <HealthItem label="Active coupons" value={coupons.filter((coupon) => coupon.active).length} detail="available at checkout" />
          <HealthItem label="Low stock products" value={lowStockCount} detail="5 units or fewer" />
          <HealthItem label="Orders awaiting action" value={orders.filter((order) => ["Pending", "Processing"].includes(order.status)).length} detail="pending or processing" />
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }) {
  return <div className="admin-card"><div className="flex items-center gap-3 text-[#d4af37]">{icon}<p className="text-xs font-bold uppercase tracking-[0.14em] text-[#cfc1a5]">{label}</p></div><p className="font-display mt-4 text-4xl font-bold text-[#f8dfa0]">{value}</p></div>;
}

function HealthItem({ label, value, detail }) {
  return <div className="rounded-lg border border-[#d4af37]/15 bg-black/20 p-4"><p className="text-[#cfc1a5]">{label}</p><p className="font-display mt-1 text-3xl font-bold text-[#d4af37]">{value}</p><p className="mt-1 text-xs text-[#cfc1a5]">{detail}</p></div>;
}

function EmptyState({ text }) {
  return <div className="grid h-60 place-items-center text-center text-[#cfc1a5]"><p>{text}</p></div>;
}

export default AnalyticsAdmin;
