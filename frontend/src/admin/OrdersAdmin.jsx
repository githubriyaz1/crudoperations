import { AdminHeader } from "./AdminOverview";
import { useOrders } from "../context/OrdersContext";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function OrdersAdmin() {
  const { orders, updateOrderStatus } = useOrders();

  return (
    <div>
      <AdminHeader title="Orders" subtitle="Review customer items, payment, address, status, and order dates." />
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Address</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <p className="font-bold">{order.customer}</p>
                    <p className="text-sm text-[#cfc1a5]">{order.email}</p>
                  </td>
                  <td>{order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}</td>
                  <td>{order.payment}</td>
                  <td>{order.address}</td>
                  <td>
                    <select className="input min-w-36" value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrdersAdmin;
