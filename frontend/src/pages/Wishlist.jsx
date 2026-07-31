import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const { wishlistItems } = useWishlist();

  return (
    <main className="page-shell">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Wishlist</p>
          <h1>Saved Favourites</h1>
          <p>Keep track of the pieces you love before adding them to cart.</p>
          <div className="gold-divider" />
        </div>

        {wishlistItems.length ? (
          <div className="product-grid">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="soft-card p-10 text-center">
            <h2 className="font-display text-3xl font-bold">Your wishlist is empty</h2>
            <p className="mt-2 text-[#746c60]">
              Tap the heart on any product to save it here.
            </p>
            <Link className="btn btn-gold mt-6" to="/shopall">
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;
