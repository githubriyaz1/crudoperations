import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";

const labels = {
  all: {
    title: "Shop All",
    subtitle: "Discover our complete premium jewellery collection.",
  },
  rings: {
    title: "Rings",
    subtitle: "Elegant rings for everyday styling and celebrations.",
  },
  studs: {
    title: "Studs",
    subtitle: "Minimal, comfortable studs with a polished finish.",
  },
  earrings: {
    title: "Earrings",
    subtitle: "Statement and daily-wear earrings for every occasion.",
  },
  chains: {
    title: "Chains",
    subtitle: "Premium chains designed for layering and gifting.",
  },
  combos: {
    title: "Combos",
    subtitle: "Curated sets for festive looks and gift-ready moments.",
  },
  bracelets: {
    title: "Bracelets",
    subtitle: "Elegant wristwear with a polished jewellery finish.",
  },
  giftbox: {
    title: "Build Your Own Gift Box",
    subtitle: "Choose premium pieces and create a memorable gift.",
  },
  bestsellers: {
    title: "Best Sellers",
    subtitle: "Customer-loved favourites from Love2Bazzar.",
  },
  gifts: {
    title: "Gift Collection",
    subtitle: "Thoughtful jewellery gifts with luxury packaging.",
  },
  newarrivals: {
    title: "New Arrivals",
    subtitle: "Freshly added Love2Bazzar favourites.",
  },
};

function CategoryPage({ category = "all" }) {
  const [sort, setSort] = useState("featured");
  const { visibleProducts } = useProducts();
  const page = labels[category] || labels.all;

  const filteredProducts = useMemo(() => {
    let result = [...visibleProducts];
    if (category && !["all", "newarrivals", "gifts", "bestsellers"].includes(category)) {
      result = result.filter((product) => product.category === category);
    }
    if (category === "bestsellers") {
      result = result.filter((product) => product.featured || product.badge === "Best Seller");
    }
    if (category === "gifts") {
      result = result.filter((product) =>
        ["giftbox", "combos", "earrings", "studs"].includes(product.category)
      );
    }
    if (category === "newarrivals") {
      result = result
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }
    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }
    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [category, sort, visibleProducts]);

  return (
    <main className="page-shell">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Love2Bazzar</p>
          <h1>{page.title}</h1>
          <p>{page.subtitle}</p>
          <div className="gold-divider" />
        </div>

        <div className="mb-8 flex flex-col gap-3 rounded-lg border border-[#eadfbe] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-[#746c60]">
            Showing {filteredProducts.length} products
          </p>
          <select
            className="input sm:max-w-56"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="soft-card p-10 text-center">
            <h2 className="font-display text-3xl font-bold">No products found</h2>
            <p className="mt-2 text-[#746c60]">Try another category.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default CategoryPage;
