import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingBag, FaStar } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../utils/toast";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { visibleProducts, addReview } = useProducts();
  const product = visibleProducts.find((item) => item.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product?.image);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: "" });

  const related = useMemo(() => {
    if (!product) return [];
    return visibleProducts
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4);
  }, [product, visibleProducts]);

  if (!product) {
    return (
      <main className="page-shell">
        <div className="container soft-card p-10 text-center">
          <h1 className="font-display text-4xl font-bold">Product not found</h1>
          <Link className="btn btn-gold mt-5" to="/shopall">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const wished = isWishlisted(product.id);

  const buyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const submitReview = (event) => {
    event.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    addReview(product.id, { name: currentUser.name, ...reviewForm });
    setReviewForm({ rating: 5, text: "" });
    showToast("Thanks! Your review is awaiting approval.");
  };

  const publishedReviews = (product.reviews || []).filter((review) => review.approved !== false);

  return (
    <main className="page-shell">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="soft-card overflow-hidden">
              <img
                src={activeImage}
                alt={product.name}
                className="aspect-square h-full w-full object-cover transition duration-500 hover:scale-110"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {product.images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-lg border ${
                    activeImage === image ? "border-[#d4af37]" : "border-[#eadfbe]"
                  }`}
                >
                  <img src={image} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <section className="soft-card p-6 md:p-8">
            <p className="eyebrow">{product.category}</p>
            <h1 className="font-display mt-2 text-5xl font-bold leading-none">
              {product.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 rounded-full bg-[#fbf1d1] px-3 py-1 font-bold text-[#8a620c]">
                <FaStar className="text-[#d4af37]" /> {product.rating}
              </span>
              <span className="rounded-full bg-green-50 px-3 py-1 font-bold text-green-700">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
              <span className="rounded-full bg-black px-3 py-1 text-sm font-bold text-[#d4af37]">
                {product.badge}
              </span>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-[#8b8374] line-through">
                Rs. {product.oldPrice.toLocaleString("en-IN")}
              </p>
              <p className="text-4xl font-black text-[#9a6b10]">
                Rs. {product.price.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 font-bold text-green-700">
                You save {product.discount}%
              </p>
            </div>

            <p className="mt-6 leading-8 text-[#746c60]">{product.description}</p>

            <div className="mt-6 grid gap-3 rounded-lg border border-[#eadfbe] bg-[#fffdf8] p-4 text-sm text-[#746c60]">
              <p>
                <strong className="text-black">Delivery:</strong> Free delivery on eligible prepaid orders.
              </p>
              <p>
                <strong className="text-black">Returns:</strong> 7-day return support for unused items.
              </p>
              <p>
                <strong className="text-black">Share:</strong> Copy this page link to share the product.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-[#eadfbe] bg-[#fffdf8]">
                <button
                  type="button"
                  className="h-11 w-11 font-bold"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  -
                </button>
                <span className="grid h-11 w-12 place-items-center font-bold">{quantity}</span>
                <button
                  type="button"
                  className="h-11 w-11 font-bold"
                  onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => toggleWishlist(product)}
              >
                {wished ? <FaHeart /> : <FaRegHeart />} Wishlist
              </button>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => addToCart(product, quantity)}
              >
                <FaShoppingBag /> Add To Cart
              </button>
              <button type="button" className="btn btn-dark" onClick={buyNow}>
                Buy Now
              </button>
            </div>
          </section>
        </div>

        <section className="mt-16">
          <div className="mb-10 grid gap-6 lg:grid-cols-3">
            <InfoPanel title="Specifications" items={product.specifications} />
            <InfoPanel
              title="Ratings"
              items={{ rating: `${product.rating}/5`, reviews: `${product.reviews?.length || 0} reviews` }}
            />
            <InfoPanel
              title="Highlights"
              items={{ stock: `${product.stock} available`, category: product.category }}
            />
          </div>
          <div className="section-title">
            <p className="eyebrow">You May Also Like</p>
            <h2>Related Products</h2>
            <div className="gold-divider" />
          </div>
          <div className="product-grid">
            {(related.length ? related : visibleProducts.slice(0, 4)).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="soft-card p-6 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="eyebrow">Verified feedback</p><h2 className="font-display mt-1 text-4xl font-bold">Customer Reviews</h2></div><span className="flex items-center gap-1 font-bold text-[#9a6b10]"><FaStar className="text-[#d4af37]" /> {product.rating} · {publishedReviews.length} reviews</span></div>
            <div className="mt-6 grid gap-4">
              {publishedReviews.length ? publishedReviews.map((review, index) => <article key={review.id || `${review.name}-${index}`} className="border-b border-[#eadfbe] pb-4 last:border-0"><div className="flex items-center justify-between gap-3"><p className="font-bold">{review.name}</p><span className="flex items-center gap-1 text-sm text-[#9a6b10]"><FaStar className="text-[#d4af37]" /> {review.rating}</span></div><p className="mt-2 leading-7 text-[#746c60]">{review.text}</p></article>) : <p className="text-[#746c60]">Be the first to share your experience with this piece.</p>}
            </div>
          </div>
          <form onSubmit={submitReview} className="soft-card h-max p-6 md:p-8">
            <p className="eyebrow">Share feedback</p><h2 className="font-display mt-1 text-3xl font-bold">Write a Review</h2>
            <label className="mt-5 grid gap-2 text-sm font-semibold text-[#5b4a22]">Your rating<select className="input" value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} star{rating > 1 ? "s" : ""}</option>)}</select></label>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-[#5b4a22]">Your review<textarea className="input min-h-28 py-3" required minLength="8" placeholder="Tell others about the product" value={reviewForm.text} onChange={(event) => setReviewForm({ ...reviewForm, text: event.target.value })} /></label>
            <button className="btn btn-gold mt-5 w-full" type="submit">{currentUser ? "Submit for approval" : "Sign in to review"}</button>
            <p className="mt-3 text-xs leading-5 text-[#746c60]">Reviews are published only after store approval.</p>
          </form>
        </section>
      </div>
    </main>
  );
}

function InfoPanel({ title, items = {} }) {
  return (
    <div className="soft-card p-5">
      <h2 className="font-display text-3xl font-bold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {Object.entries(items).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-4 border-b border-[#eadfbe] pb-2 last:border-0">
            <span className="capitalize text-[#746c60]">{key}</span>
            <span className="text-right font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetails;
