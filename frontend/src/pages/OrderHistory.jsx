import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";

function OrderHistory() {
  const { currentUser } = useAuth();
  const { orders } = useOrders();
  const userOrders = orders.filter((order) => order.email === currentUser?.email);

  return (
    <main className="page-shell">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Orders</p>
          <h1>Order History</h1>
          <p>Track your Love2Bazzar purchases and payment status.</p>
          <div className="gold-divider" />
        </div>
        <div className="grid gap-4">
          {userOrders.length ? (
            userOrders.map((order) => (
              <article key={order.id} className="soft-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl font-bold">{order.id}</h2>
                    <p className="mt-1 text-[#746c60]">{order.date} - {order.payment}</p>
                  </div>
                  <span className="rounded-full bg-[#fbf1d1] px-3 py-1 font-bold text-[#8a620c]">
                    {order.status}
                  </span>
                </div>
                <p className="mt-4 font-bold">Rs. {order.total.toLocaleString("en-IN")}</p>
                <p className="mt-2 text-[#746c60]">
                  {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                </p>
              </article>
            ))
          ) : (
            <div className="soft-card p-10 text-center">
              <h2 className="font-display text-3xl font-bold">No orders yet</h2>
              <p className="mt-2 text-[#746c60]">Your completed online orders will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default OrderHistory;
