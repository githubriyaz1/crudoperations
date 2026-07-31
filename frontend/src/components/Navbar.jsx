import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaHeart,
  FaSearch,
  FaShoppingBag,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useWishlist } from "../context/WishlistContext";
import { useStore } from "../context/StoreContext";

const collectionLinks = [
  { name: "Featured", to: "/" },
  { name: "New Arrivals", to: "/newarrivals" },
  { name: "Shop All", to: "/shopall" },
  { name: "Build Gift Box", to: "/giftbox" },
  { name: "Gifts", to: "/gifts" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { currentUser } = useAuth();
  const { categories } = useProducts();
  const { wishlistCount } = useWishlist();
  const { settings } = useStore();
  const accountPath = currentUser?.role === "admin" ? "/admin" : currentUser ? "/profile" : "/login";
  const accountLabel = currentUser?.role === "admin" ? "Admin Dashboard" : currentUser ? "My Profile" : "Sign In";

  const submitSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
    setOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#d4af37]/35 bg-black text-white shadow-lg">
        <div className="container py-2 md:py-3">
          <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 md:grid-cols-[2.75rem_auto_minmax(13.75rem,1fr)_auto] md:gap-5">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-[#d4af37]/35 text-[#d4af37] transition hover:bg-white/10"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>

          <Link
            to="/"
            className="min-w-0 select-none text-center md:text-left"
            aria-label={`${settings.storeName} home`}
          >
            <h1
              className="logo-glow truncate font-display text-[1.65rem] font-bold tracking-[0.025em] text-[#D4AF37] sm:text-3xl md:whitespace-nowrap"
            >
              {settings.storeName}
            </h1>
          </Link>

          <form
            onSubmit={submitSearch}
            className="hidden min-w-0 items-center overflow-hidden rounded-full border border-[#d4af37]/35 bg-white md:flex"
            role="search"
          >
            <input
              className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-black outline-none placeholder:text-[#766b59]"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jewellery, gifts and collections"
              aria-label="Search products"
            />
            <button
              className="grid h-11 w-12 shrink-0 place-items-center bg-[#d4af37] text-black transition hover:bg-[#f0cb58]"
              type="submit"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>

          <div className="flex items-center justify-end">
            <div className="flex md:hidden">
              <Link
                to="/cart"
                className="relative grid h-11 w-11 place-items-center rounded-full text-lg text-[#d4af37] transition hover:bg-white/10"
                aria-label="Cart"
              >
                <FaShoppingBag />
                {cartCount > 0 && <CountBubble count={cartCount} />}
              </Link>
            </div>
            <div className="hidden items-center gap-1 md:flex">
            <Link
              to={accountPath}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
              aria-label={accountLabel}
            >
              <FaUser />
            </Link>
            <Link
              to="/wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
              aria-label="Wishlist"
            >
              <FaHeart />
              {wishlistCount > 0 && <CountBubble count={wishlistCount} />}
            </Link>
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
              aria-label="Cart"
            >
              <FaShoppingBag />
              {cartCount > 0 && <CountBubble count={cartCount} />}
            </Link>
            </div>
          </div>
          </div>

          <form
            onSubmit={submitSearch}
            className="mt-2 flex items-center overflow-hidden rounded-lg border border-[#d4af37]/35 bg-white md:hidden"
            role="search"
          >
            <input
              className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-black outline-none placeholder:text-[#766b59]"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jewellery, gifts and collections"
              aria-label="Search products"
            />
            <button
              className="grid h-11 w-12 shrink-0 place-items-center bg-[#d4af37] text-black"
              type="submit"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>
        </div>
      </header>

      {open && (
  <div className="fixed inset-0 z-[60]">
        
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
            aria-label="Close menu overlay"
          />
          <aside className="relative flex h-full w-[88vw] max-w-sm flex-col bg-[#0d0902] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d4af37]/25 p-4 sm:p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#d4af37]/75">
                   Jewellery
                </p>
                <h2 className="font-display text-3xl font-bold text-[#d4af37]">
                  {settings.storeName}
                </h2>
              </div>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#d4af37]/30 text-[#d4af37]"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={submitSearch} className="border-b border-[#d4af37]/15 p-4 sm:p-5">
              <div className="flex gap-2">
                <input
                  className="input bg-[#1a1308] text-white placeholder:text-[#b99b57]"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search collections"
                />
                <button className="btn btn-gold px-4" type="submit">
                  <FaSearch />
                </button>
              </div>
            </form>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="mb-6 grid grid-cols-2 gap-2 md:hidden">
                <DrawerLink
                  link={{ name: accountLabel, to: accountPath }}
                  close={() => setOpen(false)}
                />
                <DrawerLink link={{ name: "Wishlist", to: "/wishlist" }} close={() => setOpen(false)} />
              </div>
              <p className="eyebrow mb-3">Collections</p>
              <div className="mb-7 grid gap-2">
                {collectionLinks.map((link) => (
                  <DrawerLink key={link.to} link={link} close={() => setOpen(false)} />
                ))}
              </div>
              <p className="eyebrow mb-3">Categories</p>
              <div className="grid gap-2">
                {categories.map((category) => (
                  <DrawerLink
                    key={category.value}
                    link={{ name: category.label, to: category.path }}
                    close={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function CountBubble({ count }) {
  return (
    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#d4af37] px-1 text-[11px] font-black text-black">
      {count}
    </span>
  );
}

function DrawerLink({ link, close }) {
  return (
    <Link
      to={link.to}
      onClick={close}
      className="flex items-center justify-between rounded-lg border border-[#d4af37]/10 bg-white/[0.03] px-4 py-3 font-semibold text-[#f8efd9] transition hover:border-[#d4af37]/45 hover:text-[#d4af37]"
    >
      {link.name}
      <span className="text-[#d4af37]">/</span>
    </Link>
  );
}

export default Navbar;
