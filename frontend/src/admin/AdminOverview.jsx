import { useEffect, useState } from "react";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import { AdminService } from "../services/admin.service";

function AdminOverview() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { users } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let active = true;
    const loadSummary = async () => {
      try {
        const data = await AdminService.getDashboardSummary();
        if (active && data) setSummary(data);
      } catch {
        // Fallback
      }
    };
    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  const totalProducts = summary?.totalProducts ?? products.length;
  const totalOrders = summary?.totalOrders ?? orders.length;
  const totalUsers = summary?.totalUsers ?? users.length;
  const revenue = summary?.totalRevenue ?? orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const recentOrdersList = summary?.recentOrders ?? orders.slice(0, 5);

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="A premium Shopify-style overview for daily store operations." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Products" value={totalProducts} />
        <Metric label="Orders" value={totalOrders} />
        <Metric label="Revenue" value={`Rs. ${revenue.toLocaleString("en-IN")}`} />
        <Metric label="Customers" value={totalUsers} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="admin-card">
          <h2 className="admin-title">Recent Orders</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersList.map((order) => (
                  <tr key={order.id || order._id}>
                    <td>{order.id || order.orderNumber}</td>
                    <td>{order.customer || order.customerName}</td>
                    <td>{order.status}</td>
                    <td>Rs. {(order.total || 0).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="admin-card">
          <h2 className="admin-title">Recent Products</h2>
          <div className="mt-4 grid gap-3">
            {products.slice(0, 5).map((product) => (
              <div key={product.id || product._id} className="flex items-center gap-3 rounded-lg bg-white/[0.04] p-3">
                <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#f8dfa0]">{product.name}</p>
                  <p className="text-sm text-[#cfc1a5]">Rs. {(product.price || 0).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-card mt-6">
        <h2 className="admin-title">Sales Chart</h2>
        <div className="mt-5 flex h-56 items-end gap-3">
          {[44, 68, 54, 82, 76, 96, 72].map((height, index) => (
            <div key={height + index} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[#b8860b] to-[#d4af37]"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-[#cfc1a5]">D{index + 1}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdminHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow">Love2Bazzar Admin</p>
        <h1 className="font-display mt-2 text-4xl font-bold text-[#f8dfa0] md:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-[#cfc1a5]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="admin-card">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#cfc1a5]">
        {label}
      </p>
      <p className="font-display mt-3 text-4xl font-bold text-[#d4af37]">{value}</p>
    </div>
  );
}

export default AdminOverview;
