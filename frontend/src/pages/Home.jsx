import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaGem, FaGift, FaHeadset, FaLock, FaShippingFast, FaStar } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { NewsletterService } from "../services/newsletter.service";

const trustItems = [
  "Free Shipping Above Rs. 499",
  "Premium Quality",
  "Handcrafted Jewellery",
  "Gift Ready Packaging",
  "Secure Checkout",
];

const whyItems = [
  {
    icon: <FaGem />,
    title: "Premium Quality",
    text: "Carefully selected pieces with refined polish and elegant finishing.",
  },
  {
    icon: <FaLock />,
    title: "Secure Payments",
    text: "Checkout is designed for future Razorpay integration and safe orders.",
  },
  {
    icon: <FaShippingFast />,
    title: "Fast Delivery",
    text: "Gift-ready packaging and dependable dispatch for every celebration.",
  },
  {
    icon: <FaHeadset />,
    title: "Customer Support",
    text: "Friendly help for sizing, gifting, product details, and orders.",
  },
];

function Home() {
  const { visibleProducts, categories } = useProducts();
  const featured = visibleProducts.filter((product) => product.featured).slice(0, 4);
  const signatureProducts = featured.length ? featured : visibleProducts.slice(0, 4);

  return (
    <main>
      <section className="relative overflow-hidden bg-[#080602] text-white">
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/72 to-black" />
        <div className="container relative grid min-h-[calc(100svh-128px)] content-center py-14 sm:min-h-[82vh] sm:py-20">
          <p className="eyebrow text-[#e7c55c]">Handcrafted With Love</p>
          <span className="mt-4 w-max rounded-full border border-[#d4af37]/45 bg-[#d4af37]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#f8dfa0]">
            Free shipping above Rs. 499
          </span>
          <h1 className="font-display mt-5 max-w-4xl text-[clamp(2.8rem,15vw,3.75rem)] font-bold leading-[0.92] tracking-normal text-[#f8dfa0] md:text-8xl">
            Love2Bazzar
          </h1>
          <p className="font-luxury mt-6 max-w-xl text-2xl text-[#f8efd9]">
            Elegant Collections For Every Occasion
          </p>
          <p className="mt-5 max-w-xl leading-8 text-[#d9ceb7]">
            Discover rings, studs, earrings, chains, combos, and premium gift
            boxes crafted for modern celebrations.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link className="btn btn-gold w-full sm:w-auto" to="/shopall">
              Explore Collection
            </Link>
            <Link className="btn btn-light w-full sm:w-auto" to="/giftbox">
              <FaGift /> View Gift Boxes
            </Link>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-[#d4af37]/25 border-y border-[#d4af37]/25 py-4 text-center">
            <div><p className="font-display text-2xl font-bold text-[#f8dfa0]">100+</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#cfc1a5]">Gift ideas</p></div>
            <div><p className="font-display text-2xl font-bold text-[#f8dfa0]">4.9/5</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#cfc1a5]">Loved by buyers</p></div>
            <div><p className="font-display text-2xl font-bold text-[#f8dfa0]">Easy</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#cfc1a5]">Secure checkout</p></div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-black py-3 text-[#d4af37]">
        <div className="flex w-max animate-[marquee_24s_linear_infinite] gap-10 whitespace-nowrap">
          {[...trustItems, ...trustItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="text-sm font-bold uppercase tracking-[0.18em]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="page-shell home-section">
        <div className="container">
          <div className="section-title">
            <p className="eyebrow">Browse</p>
            <h2>Shop By Category</h2>
            <p>Quickly enter your favourite jewellery collection.</p>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.value}
                to={category.path}
                className="soft-card group p-4 text-center transition hover:-translate-y-1 hover:border-[#d4af37] sm:p-5"
              >
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#fbf1d1] text-2xl text-[#9a6b10]">
                  <FaGem />
                </div>
                <span className="font-bold uppercase tracking-[0.12em] text-[#5b4a22]">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell home-section bg-white">
        <div className="container">
          <div className="section-title">
            <p className="eyebrow">Featured</p>
            <h2>Signature Picks</h2>
            <p>Popular pieces selected for gifting, daily styling, and festive looks.</p>
            <div className="gold-divider" />
          </div>
          <div className="product-grid">
            {signatureProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell home-section bg-[#f3ebdc]">
        <div className="container overflow-hidden rounded-2xl bg-[#151006] text-white">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="order-2 p-7 sm:p-10 lg:order-1 lg:p-14">
              <p className="eyebrow text-[#e7c55c]">Thoughtful gifting</p>
              <h2 className="font-display mt-3 text-4xl font-bold leading-none text-[#f8dfa0] sm:text-5xl">A beautiful gift, made simple.</h2>
              <p className="mt-5 max-w-lg leading-8 text-[#d5c7ad]">Choose a ready-to-gift box or combine favourite pieces into one memorable surprise. Every order is packed with care.</p>
              <div className="mt-7 grid gap-3 text-sm font-semibold text-[#f8efd9] sm:grid-cols-2">
                <p className="rounded-lg border border-[#d4af37]/25 bg-white/[0.04] p-3">✓ Gift-ready presentation</p>
                <p className="rounded-lg border border-[#d4af37]/25 bg-white/[0.04] p-3">✓ Fast, trackable dispatch</p>
              </div>
              <Link className="btn btn-gold mt-8" to="/giftbox">Build a Gift Box <FaArrowRight /></Link>
            </div>
            <div className="order-1 min-h-64 bg-[#30230e] lg:order-2 lg:min-h-full">
              <img
                src={signatureProducts[0]?.image}
                alt="Premium gift-ready jewellery collection"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell home-section">
        <div className="container">
          <div className="section-title">
            <p className="eyebrow">Our Promise</p>
            <h2>Why Choose Us</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => (
              <div key={item.title} className="soft-card p-6 text-center">
                <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#fbf1d1] text-2xl text-[#9a6b10]">
                  {item.icon}
                </div>
                <h3 className="font-display text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#746c60]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell home-section bg-[#0d0902] text-white">
        <div className="container grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Testimonials</p>
            <h2 className="font-display mt-3 text-4xl font-bold text-[#f8dfa0] sm:text-5xl">
              Loved By Customers
            </h2>
            <p className="mt-4 leading-8 text-[#cfc1a5]">
              Premium packaging, comfortable jewellery, and thoughtful designs
              make Love2Bazzar a beautiful choice for everyday gifting.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {["The gift box felt so premium.", "Beautiful finish and fast delivery."].map(
              (text, index) => (
                <div key={text} className="rounded-lg border border-[#d4af37]/20 bg-white/[0.04] p-6">
                  <div className="mb-3 flex gap-1 text-[#d4af37]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} />
                    ))}
                  </div>
                  <p className="leading-7 text-[#f4ead8]">{text}</p>
                  <p className="mt-4 text-sm font-bold text-[#d4af37]">
                    {index === 0 ? "Ananya S." : "Rahul V."}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="page-shell home-section bg-white">
        <NewsletterBlock />
      </section>
    </main>
  );
}

function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMsg("");
    setSubmitting(true);
    try {
      const res = await NewsletterService.subscribe(email);
      setMsg(res.message || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to subscribe.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container rounded-lg border border-[#eadfbe] bg-[#faf7f0] p-8 text-center md:p-12">
      <p className="eyebrow">Newsletter</p>
      <h2 className="font-display mt-2 text-4xl font-bold">
        Receive New Launches And Offers
      </h2>
      {msg && <p className="mt-3 font-semibold text-[#9a6b10]">{msg}</p>}
      <form onSubmit={handleSubscribe} className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
        <input
          className="input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
        />
        <button className="btn btn-gold shrink-0" type="submit" disabled={submitting}>
          {submitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}

export default Home;
