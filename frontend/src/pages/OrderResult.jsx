import { Link, useLocation } from "react-router-dom";

function OrderResult({ success = true }) {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <main className="page-shell">
      <div className="container soft-card p-10 text-center">
        <p className="eyebrow">{success ? "Payment Successful" : "Payment Failed"}</p>
        <h1 className="font-display mt-2 text-5xl font-bold">
          {success ? "Order Placed" : "Please Try Again"}
        </h1>
        {order && (
          <p className="mt-3 text-[#746c60]">
            Order {order.id} is {order.status}. Total Rs. {order.total.toLocaleString("en-IN")}.
          </p>
        )}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link className="btn btn-gold" to="/profile">
            Order History
          </Link>
          <Link className="btn btn-light" to="/shopall">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderResult;
