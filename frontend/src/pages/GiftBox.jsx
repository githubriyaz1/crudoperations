import { useMemo, useState } from "react";
import { FaCheck, FaGift, FaShoppingBag, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

const giftPacks = [
  {
    id: "giftbox-399",
    name: "Sweet Surprise Gift Box",
    price: 399,
    oldPrice: 499,
    badge: "Starter Gift",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80",
    description: "A neat gift-ready box for small surprises, add-ons, and quick celebrations.",
  },
  {
    id: "giftbox-599",
    name: "Premium Partner Gift Box",
    price: 599,
    oldPrice: 799,
    badge: "Most Loved",
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1000&q=80",
    description: "A richer gift box made for birthdays, anniversaries, and thoughtful moments.",
  },
];

function GiftBox() {
  const { visibleProducts } = useProducts();
  const { addToCart } = useCart();
  const [activePack, setActivePack] = useState(giftPacks[0]);
  const [selectedIds, setSelectedIds] = useState([]);

  const giftProducts = useMemo(
    () =>
      visibleProducts
        .filter((product) => product.category !== "giftbox")
        .slice()
        .sort((a, b) => b.rating - a.rating),
    [visibleProducts]
  );

  const selectedProducts = useMemo(
    () => giftProducts.filter((product) => selectedIds.includes(product.id)),
    [giftProducts, selectedIds]
  );

  const toggleProduct = (productId) => {
    setSelectedIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }
      if (current.length >= 5) {
        return current;
      }
      return [...current, productId];
    });
  };

  const choosePack = (pack) => {
    setActivePack(pack);
    document.getElementById("gift-builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addGiftBox = () => {
    const selectedNames = selectedProducts.map((product) => product.name).join(", ");
    addToCart({
      id: `${activePack.id}-${selectedIds.join("-") || "custom"}`,
      name: activePack.name,
      category: "giftbox",
      price: activePack.price,
      oldPrice: activePack.oldPrice,
      discount: Math.round(((activePack.oldPrice - activePack.price) / activePack.oldPrice) * 100),
      rating: 5,
      stock: 20,
      badge: activePack.badge,
      image: activePack.image,
      images: [activePack.image],
      description: selectedNames
        ? `Gift box with: ${selectedNames}`
        : activePack.description,
      selectedProducts,
    });
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-[#080602] text-white">
        <div
          className="absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1800&q=80)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/58 to-[#faf7f0]" />
        <div className="container relative grid min-h-[58vh] content-center py-16">
          <p className="eyebrow">Build Gift Box</p>
          <h1 className="font-display mt-4 max-w-4xl text-[clamp(2.45rem,13vw,3.75rem)] font-bold leading-none text-[#f8dfa0] md:text-7xl">
            A Small Box, A Big Smile
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#f7efd8]">
            Gift your partner a box of little favourites. Pick a 399 or 599 gift
            box, then select up to 5 jewellery products to place inside.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-gold" href="#gift-builder">
              <FaGift /> Start Building
            </a>
            <Link className="btn btn-light" to="/shopall">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="container">
          <div className="section-title">
            <p className="eyebrow">Choose Box</p>
            <h2>Gift Box Plans</h2>
            <p>Click any gift box to open all products and build your selection.</p>
            <div className="gold-divider" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {giftPacks.map((pack) => {
              const active = activePack.id === pack.id;
              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => choosePack(pack)}
                  className={`soft-card group overflow-hidden text-left transition hover:-translate-y-1 hover:border-[#d4af37] ${
                    active ? "ring-2 ring-[#d4af37]" : ""
                  }`}
                >
                  <div className="grid md:grid-cols-[42%_1fr]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#f2ead7] md:aspect-auto">
                      <img
                        src={pack.image}
                        alt={pack.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#f8dfa0]">
                        {pack.badge}
                      </span>
                    </div>
                    <div className="grid content-center p-5 md:p-7">
                      <h3 className="font-display text-3xl font-bold text-black md:text-4xl">
                        {pack.name}
                      </h3>
                      <p className="mt-3 leading-7 text-[#746c60]">{pack.description}</p>
                      <div className="mt-5 flex flex-wrap items-end gap-3">
                        <span className="text-4xl font-black text-[#9a6b10]">
                          Rs. {pack.price}
                        </span>
                        <span className="pb-1 text-sm font-bold text-[#8b8374] line-through">
                          Rs. {pack.oldPrice}
                        </span>
                      </div>
                      <span className="btn btn-dark mt-6 w-max">
                        {active ? <FaCheck /> : <FaGift />}
                        {active ? "Selected Box" : "Select This Box"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="gift-builder" className="page-shell bg-white">
        <div className="container">
          <div className="mb-8 grid gap-4 rounded-lg border border-[#eadfbe] bg-[#faf7f0] p-4 md:grid-cols-[1fr_auto] md:items-center md:p-6">
            <div>
              <p className="eyebrow">Gift Builder</p>
              <h2 className="font-display mt-1 text-3xl font-bold md:text-4xl">
                {activePack.name}
              </h2>
              <p className="mt-2 text-[#746c60]">
                Select any 5 products. Admin-added visible products will appear here automatically.
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-[0_12px_32px_rgba(40,25,0,0.06)]">
              <p className="text-sm font-bold text-[#746c60]">
                Selected {selectedProducts.length}/5
              </p>
              <p className="text-3xl font-black text-[#9a6b10]">Rs. {activePack.price}</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="product-grid">
              {giftProducts.map((product) => {
                const selected = selectedIds.includes(product.id);
                const disabled = !selected && selectedIds.length >= 5;
                return (
                  <article
                    key={product.id}
                    className={`soft-card overflow-hidden transition ${
                      selected ? "ring-2 ring-[#d4af37]" : "hover:-translate-y-1"
                    } ${disabled ? "opacity-55" : ""}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#f2ead7]">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      {selected && (
                        <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[#d4af37] text-black">
                          <FaCheck />
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="eyebrow">{product.category}</p>
                        <span className="flex items-center gap-1 text-sm font-bold text-[#9a6b10]">
                          <FaStar className="text-[#d4af37]" /> {product.rating}
                        </span>
                      </div>
                      <h3 className="font-display min-h-16 text-2xl font-bold leading-tight">
                        {product.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 min-h-11 text-sm leading-6 text-[#746c60]">
                        {product.description}
                      </p>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => toggleProduct(product.id)}
                        className={`btn mt-5 w-full ${selected ? "btn-dark" : "btn-gold"} disabled:cursor-not-allowed`}
                      >
                        {selected ? <FaCheck /> : <FaGift />}
                        {selected ? "Added" : "Add To Gift"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="soft-card h-max p-5 lg:sticky lg:top-24">
              <p className="eyebrow">Your Gift</p>
              <h2 className="font-display mt-1 text-3xl font-bold">Selected Products</h2>
              <div className="my-4 border-t border-[#eadfbe]" />
              {selectedProducts.length > 0 ? (
                <div className="grid gap-3">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <img src={product.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-bold">{product.name}</p>
                        <p className="text-sm capitalize text-[#746c60]">{product.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="leading-7 text-[#746c60]">
                  No products selected yet. Pick up to 5 favourites for a complete gift.
                </p>
              )}
              <div className="my-5 border-t border-[#eadfbe]" />
              <div className="flex items-center justify-between text-lg font-black">
                <span>Total</span>
                <span className="text-[#9a6b10]">Rs. {activePack.price}</span>
              </div>
              <button
                type="button"
                onClick={addGiftBox}
                className="btn btn-gold mt-5 w-full"
              >
                <FaShoppingBag /> Add Gift Box To Cart
              </button>
              <p className="mt-3 text-center text-xs font-semibold text-[#746c60]">
                You can add now and edit selection by rebuilding another box.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default GiftBox;
