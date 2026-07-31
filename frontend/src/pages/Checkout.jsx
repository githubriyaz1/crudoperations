import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTruck, FaMoneyBillWave } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useCoupons } from "../context/CouponContext";
import { showToast } from "../utils/toast";

function Checkout() {
  const { cartItems, subtotal, shipping, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { createOrder } = useOrders();
  const { validateCoupon, redeemCoupon } = useCoupons();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [placing, setPlacing] = useState(false);

  const gst = Math.round(subtotal * 0.03);
  const couponResult = appliedCoupon ? validateCoupon(appliedCoupon.code, subtotal) : null;
  const couponDiscount = couponResult?.valid ? couponResult.discount : 0;
  const payable = Math.max(0, total + gst - couponDiscount);

  const applyCoupon = () => {
    const result = validateCoupon(couponCode, subtotal);
    if (!result.valid) {
      setAppliedCoupon(null);
      setCouponMessage(result.message);
      return;
    }
    setAppliedCoupon(result.coupon);
    setCouponCode(result.coupon.code);
    setCouponMessage(`Coupon applied — you saved Rs. ${result.discount.toLocaleString("en-IN")}.`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (appliedCoupon && !couponResult?.valid) {
      setAppliedCoupon(null);
      setCouponMessage(couponResult?.message || "This coupon can no longer be used.");
      showToast("Please review the coupon before placing the order.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const customer = form.get("name");
    const email = form.get("email");
    const phone = form.get("phone");
    const address = `${form.get("address")}, ${form.get("city")}, ${form.get("state")} ${form.get("pincode")}`;

    setPlacing(true);
    try {
      const order = await createOrder({
        customer,
        email,
        phone,
        address,
        payment: "Pay on Delivery",
        paymentMethod: "Pay on Delivery",
        total: payable,
        coupon: appliedCoupon
          ? { code: appliedCoupon.code, discount: couponDiscount }
          : null,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      if (appliedCoupon) redeemCoupon(appliedCoupon.id);
      clearCart();
      navigate("/order-success", { state: { order } });
    } catch {
      showToast("Failed to place order. Please check details.");
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="page-shell">
        <div className="container soft-card p-10 text-center">
          <h1 className="font-display text-4xl font-bold">No items to checkout</h1>
          <Link className="btn btn-gold mt-5" to="/shopall">
            Shop Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Checkout</p>
          <h1>Complete Your Order</h1>
          <p>Enter delivery details and confirm your order.</p>
          <div className="gold-divider" />
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="soft-card grid gap-5 p-6">
            <h2 className="font-display text-3xl font-bold">Customer Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="input" name="name" required placeholder="Full name" defaultValue={currentUser?.name || ""} />
              <input className="input" name="phone" required type="tel" placeholder="Phone number" defaultValue={currentUser?.phone || ""} />
            </div>
            <input className="input" name="email" required type="email" placeholder="Email address" defaultValue={currentUser?.email || ""} />
            <textarea
              className="input min-h-28 py-3"
              name="address"
              required
              placeholder="Full delivery address"
              defaultValue={currentUser?.addresses?.[0] || ""}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <input className="input" name="city" required placeholder="City" />
              <input className="input" name="state" required placeholder="State" />
              <input className="input" name="pincode" required placeholder="Pincode" />
            </div>

            <div>
              <h3 className="font-display mb-3 text-2xl font-bold">Payment Method</h3>
              <div className="rounded-xl border-2 border-[#d4af37] bg-[#fdf9ee] p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#d4af37] text-white">
                    <FaMoneyBillWave className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#3d2f08]">Pay on Delivery (Cash on Delivery)</h4>
                    <p className="text-xs text-[#746c60]">Pay cash or UPI to the delivery executive upon order arrival.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="soft-card h-max p-6">
            <h2 className="font-display text-3xl font-bold">Order Summary</h2>
            <div className="mt-5 grid gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-[#746c60]">Qty {item.quantity}</p>
                  </div>
                  <p className="font-bold">
                    Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
            <div className="my-5 border-t border-[#eadfbe]" />
            <div className="mt-5 rounded-lg border border-[#eadfbe] bg-[#fffdf8] p-3">
              <label className="text-sm font-bold text-[#5b4a22]" htmlFor="coupon-code">
                Have a coupon?
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="coupon-code"
                  className="input min-w-0 uppercase"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(event) => {
                    setCouponCode(event.target.value.toUpperCase());
                    setCouponMessage("");
                  }}
                />
                {appliedCoupon ? (
                  <button
                    className="btn btn-light shrink-0 px-4"
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode("");
                      setCouponMessage("Coupon removed.");
                    }}
                  >
                    Remove
                  </button>
                ) : (
                  <button className="btn btn-dark shrink-0 px-4" type="button" onClick={applyCoupon}>
                    Apply
                  </button>
                )}
              </div>
              {couponMessage && (
                <p className={`mt-2 text-xs font-semibold ${appliedCoupon ? "text-emerald-700" : "text-[#9a6b10]"}`}>
                  {couponMessage}
                </p>
              )}
            </div>
            <div className="mt-5 grid gap-2 text-[#746c60]">
              <Row label="Subtotal" value={subtotal} />
              <Row label="GST (3%)" value={gst} />
              <Row label="Shipping" value={shipping} free={shipping === 0} />
              {couponDiscount > 0 && <Row label={`Coupon (${appliedCoupon.code})`} value={couponDiscount} negative />}
            </div>
            <div className="my-5 border-t border-[#eadfbe]" />
            <Row label="Total" value={payable} strong />
            <button className="btn btn-gold mt-6 w-full" type="submit" disabled={placing}>
              <FaTruck className="inline mr-2" />
              {placing ? "Placing Order..." : "Place Order (Pay on Delivery)"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Row({ label, value, free = false, strong = false, negative = false }) {
  return (
    <div className={`flex justify-between ${strong ? "text-xl font-black" : ""}`}>
      <span>{label}</span>
      <span>{free ? "Free" : `${negative ? "− " : ""}Rs. ${value.toLocaleString("en-IN")}`}</span>
    </div>
  );
}

export default Checkout;
