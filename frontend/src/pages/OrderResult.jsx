import { Link, useLocation } from "react-router-dom";
import { FaWhatsapp, FaEnvelope, FaClipboardList, FaCheckCircle } from "react-icons/fa";

function OrderResult({ success = true }) {
  const location = useLocation();
  const order = location.state?.order;

  const whatsappMessage = order
    ? encodeURIComponent(
        `Hi Love2Bazzar! I placed a new Pay on Delivery order:\n\n` +
          `📦 Order ID: ${order.id || order.orderNumber}\n` +
          `👤 Customer: ${order.customer || order.customerName}\n` +
          `📞 Phone: ${order.phone}\n` +
          `📍 Address: ${typeof order.address === "string" ? order.address : order.address?.address || ""}\n` +
          `💰 Total: Rs. ${(order.total || 0).toLocaleString("en-IN")}\n` +
          `💳 Payment: Pay on Delivery (COD)\n\n` +
          `Items:\n` +
          (order.items || [])
            .map((item) => `• ${item.name} (x${item.quantity}) - Rs. ${(item.price * item.quantity).toLocaleString("en-IN")}`)
            .join("\n")
      )
    : "";

  const whatsappUrl = `https://wa.me/916374253665?text=${whatsappMessage}`;

  return (
    <main className="page-shell">
      <div className="container max-w-3xl">
        <div className="soft-card p-8 md:p-12 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
            <FaCheckCircle />
          </div>
          <p className="eyebrow">{success ? "Order Confirmed" : "Payment Failed"}</p>
          <h1 className="font-display mt-2 text-4xl md:text-5xl font-bold">
            {success ? "Thank You For Your Order!" : "Please Try Again"}
          </h1>

          {order && (
            <div className="mt-6 text-left rounded-xl border border-[#eadfbe] bg-[#faf7f0] p-6">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#eadfbe] pb-4 mb-4">
                <div>
                  <p className="text-xs uppercase font-bold text-[#9a6b10]">Order Number</p>
                  <p className="font-display text-2xl font-bold">{order.id || order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase font-bold text-[#9a6b10]">Payment Method</p>
                  <p className="font-bold text-emerald-700">Pay on Delivery</p>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-[#5b4a22]">
                <p><strong>Customer:</strong> {order.customer || order.customerName} ({order.email})</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Address:</strong> {typeof order.address === "string" ? order.address : order.address?.address || ""}</p>
                <p><strong>Total Amount:</strong> Rs. {(order.total || 0).toLocaleString("en-IN")}</p>
              </div>

              <div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-xs leading-5 text-emerald-900">
                <p className="font-bold text-sm mb-1 flex items-center gap-2">
                  <FaClipboardList className="text-emerald-700" />
                  Owner Notification Channels Active:
                </p>
                <ul className="list-disc pl-5 grid gap-1">
                  <li><strong>Admin Portal:</strong> Registered in live Admin Dashboard (`/admin/orders`).</li>
                  <li><strong>Email Notification:</strong> Dispatched to Store Owner Gmail (`nellaiestates26@gmail.com`).</li>
                  <li><strong>WhatsApp Direct:</strong> Use button below to notify store owner on WhatsApp instantly.</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {order && (
              <a
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white min-h-12 px-6"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="text-xl" />
                Send Order to Owner on WhatsApp
              </a>
            )}
            <Link className="btn btn-gold min-h-12 px-6" to="/profile">
              View Order History
            </Link>
            <Link className="btn btn-light min-h-12 px-6" to="/shopall">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderResult;
