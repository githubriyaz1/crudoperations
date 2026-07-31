import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    shipping,
    total,
  } = useCart();

  return (
    <main className="page-shell">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Shopping Bag</p>
          <h1>Your Cart</h1>
          <p>Review your jewellery selections before checkout.</p>
          <div className="gold-divider" />
        </div>

        {cartItems.length === 0 ? (
          <div className="soft-card p-10 text-center">
            <h2 className="font-display text-3xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-[#746c60]">
              Add rings, earrings, chains, or gift boxes to begin.
            </p>
            <Link className="btn btn-gold mt-6" to="/shopall">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <section className="grid gap-4">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="soft-card grid gap-4 p-4 sm:grid-cols-[110px_1fr_auto] sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-square w-28 rounded-lg object-cover"
                  />
                  <div>
                    <p className="eyebrow">{item.category}</p>
                    <Link to={item.category === "giftbox" ? "/giftbox" : `/product/${item.id}`}>
                      <h2 className="font-display text-3xl font-bold">{item.name}</h2>
                    </Link>
                    {item.category === "giftbox" && item.description && (
                      <p className="mt-2 max-w-xl text-sm leading-6 text-[#746c60]">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-1 font-black text-[#9a6b10]">
                      Rs. {item.price.toLocaleString("en-IN")}
                    </p>
                    <div className="mt-4 flex w-max items-center rounded-full border border-[#eadfbe] bg-[#fffdf8]">
                      <button
                        type="button"
                        className="h-10 w-10 font-bold"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="grid h-10 w-10 place-items-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="h-10 w-10 font-bold"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                    <p className="text-xl font-black">
                      Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-red-600"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="soft-card h-max p-6">
              <h2 className="font-display text-3xl font-bold">Order Summary</h2>
              <div className="mt-5 grid gap-3 text-[#746c60]">
                <SummaryRow label="Subtotal" value={subtotal} />
                <SummaryRow label="Shipping" value={shipping} free={shipping === 0} />
              </div>
              <div className="my-5 border-t border-[#eadfbe]" />
              <SummaryRow label="Total" value={total} strong />
              <Link className="btn btn-gold mt-6 w-full" to="/checkout">
                Checkout
              </Link>
              <Link className="btn btn-light mt-3 w-full" to="/shopall">
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryRow({ label, value, free = false, strong = false }) {
  return (
    <div className={`flex justify-between ${strong ? "text-xl font-black" : ""}`}>
      <span>{label}</span>
      <span>{free ? "Free" : `Rs. ${value.toLocaleString("en-IN")}`}</span>
    </div>
  );
}

export default Cart;
