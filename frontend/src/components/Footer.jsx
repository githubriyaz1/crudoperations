import { Link } from "react-router-dom";
import { FaInstagram, FaPhoneAlt, FaRegEnvelope } from "react-icons/fa";
import { useProducts } from "../context/ProductContext";
import { useStore } from "../context/StoreContext";

function Footer() {
  const { categories } = useProducts();
  const { settings } = useStore();

  return (
    <footer className="bg-[#090602] text-white">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="eyebrow">Luxury Jewellery</p>
          <h2 className="font-display mt-2 text-4xl font-bold text-[#d4af37]">
            {settings.storeName}
          </h2>
          <p className="mt-4 max-w-sm leading-7 text-[#a99d87]">
            Handpicked jewellery, elegant gift boxes, and premium packaging for
            every occasion.
          </p>
          <a
            href="https://www.instagram.com/love2bazzar?igsh=MXcyYXVjZXdxdXZvMQ=="
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-[#d4af37]"
          >
            <FaInstagram /> Instagram
          </a>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#d4af37]">
            Shop
          </h3>
          <div className="grid gap-3 text-[#bfb29a]">
            <Link to="/shopall">Shop All</Link>
            <Link to="/newarrivals">New Arrivals</Link>
            <Link to="/giftbox">Build Gift Box</Link>
            {categories.slice(0, 4).map((category) => (
              <Link key={category.value} to={category.path}>
                {category.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#d4af37]">
            Contact
          </h3>
          <div className="grid gap-3 text-[#bfb29a]">
            <p>{settings.address}</p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#d4af37]" /> {settings.phone}
            </p>
            <p className="flex items-center gap-2">
              <FaRegEnvelope className="text-[#d4af37]" /> {settings.email}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-[#d4af37]/15 py-5 text-center text-sm text-[#776d5d]">
        Copyright 2026 {settings.storeName}. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
