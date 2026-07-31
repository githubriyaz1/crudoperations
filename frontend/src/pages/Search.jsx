import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { SearchService } from "../services/search.service";

function Search() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("5000");
  const { visibleProducts, categories } = useProducts();
  const [backendResults, setBackendResults] = useState(null);
  const [backendSuggestions, setBackendSuggestions] = useState([]);

  useEffect(() => {
    let active = true;
    const executeSearch = async () => {
      try {
        const res = await SearchService.search({
          q: query,
          category: category !== "all" ? category : "",
          maxPrice: maxPrice !== "5000" ? maxPrice : "",
        });
        if (active && res?.data) {
          setBackendResults(res.data);
        }
      } catch {
        if (active) setBackendResults(null);
      }
    };

    const timer = setTimeout(executeSearch, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, category, maxPrice]);

  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      if (!query.trim() || query.trim().length < 2) {
        setBackendSuggestions([]);
        return;
      }
      try {
        const res = await SearchService.getSuggestions(query);
        if (active && res?.products) {
          setBackendSuggestions(res.products);
        }
      } catch {
        if (active) setBackendSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const results = useMemo(() => {
    if (backendResults !== null) return backendResults;

    const normalized = query.trim().toLowerCase();
    return visibleProducts.filter((product) => {
      const matchesText =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        (product.category && product.category.toLowerCase().includes(normalized));
      const matchesCategory = category === "all" || product.category === category;
      const matchesPrice = product.price <= Number(maxPrice);
      return matchesText && matchesCategory && matchesPrice;
    });
  }, [backendResults, query, category, maxPrice, visibleProducts]);

  const suggestions = useMemo(() => {
    if (backendSuggestions.length > 0) return backendSuggestions;
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return visibleProducts
      .filter(
        (product) =>
          product.name.toLowerCase().includes(normalized) ||
          (product.category && product.category.toLowerCase().includes(normalized))
      )
      .slice(0, 5);
  }, [backendSuggestions, query, visibleProducts]);

  return (
    <main className="page-shell">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Search</p>
          <h1>Find Your Perfect Piece</h1>
          <p>Search by name, category, and price in real time.</p>
          <div className="gold-divider" />
        </div>

        <div className="mb-8 grid gap-4 rounded-lg border border-[#eadfbe] bg-white p-5 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <input
              className="input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search rings, studs, gift boxes..."
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-lg border border-[#eadfbe] bg-white shadow-xl">
                {suggestions.map((product) => (
                  <button
                    key={product.id || product._id || product.slug}
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#faf7f0]"
                    onClick={() => setQuery(product.name)}
                  >
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-sm capitalize text-[#746c60]">
                      Rs. {product.price?.toLocaleString("en-IN")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <select
            className="input"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            aria-label="Filter by price"
          >
            <option value="1000">Under Rs. 1,000</option>
            <option value="2000">Under Rs. 2,000</option>
            <option value="3000">Under Rs. 3,000</option>
            <option value="5000">All Prices</option>
          </select>
        </div>

        <p className="mb-5 font-semibold text-[#746c60]">
          {results.length} matching products
        </p>
        {results.length ? (
          <div className="product-grid">
            {results.map((product) => (
              <ProductCard key={product.id || product._id || product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="soft-card p-10 text-center">
            <h2 className="font-display text-3xl font-bold">No matches found</h2>
            <p className="mt-2 text-[#746c60]">Try a different keyword or category.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Search;
