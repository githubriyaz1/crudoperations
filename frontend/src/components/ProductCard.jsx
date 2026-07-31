import { Link } from "react-router-dom";
import { FaEye, FaHeart, FaRegHeart, FaShoppingBag, FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wished = isWishlisted(product.id);

  return (
    <article className="group soft-card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(40,25,0,0.16)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f2ead7]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/82 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#f8dfa0]">
          {product.badge}
        </span>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/92 text-[#9a6b10] shadow transition hover:bg-[#d4af37] hover:text-black"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wished ? <FaHeart /> : <FaRegHeart />}
        </button>
        <Link
          to={`/product/${product.id}`}
          className="quick-view absolute bottom-3 left-3 right-3 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <span className="btn btn-dark w-full">
            <FaEye /> Quick View
          </span>
        </Link>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="eyebrow">{product.category}</p>
          <span className="flex items-center gap-1 text-sm font-bold text-[#9a6b10]">
            <FaStar className="text-[#d4af37]" /> {product.rating}
          </span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-2xl font-bold leading-tight text-black transition hover:text-[#9a6b10]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 min-h-11 text-sm leading-6 text-[#766b59]">
          {product.description}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#8b8374] line-through">
              Rs. {product.oldPrice.toLocaleString("en-IN")}
            </p>
            <p className="text-xl font-black text-[#9a6b10] sm:text-2xl">
              Rs. {product.price.toLocaleString("en-IN")}
            </p>
          </div>
          <span className="rounded-full bg-[#f7edcf] px-3 py-1 text-xs font-bold text-[#7a5c00]">
            {product.discount}% off
          </span>
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="btn btn-gold mt-5 w-full"
        >
          <FaShoppingBag /> Add To Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
