/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import seedProducts, { categories as seedCategories } from "../data/products";
import { readStorage, writeStorage } from "../utils/storage";
import { CategoryService } from "../services/category.service";
import { ProductService } from "../services/product.service";

const ProductContext = createContext(null);
const PRODUCTS_KEY = "love2bazzar_products";
const CATEGORIES_KEY = "love2bazzar_categories";

const extendedCategories = [
  ...seedCategories,
  { label: "Bracelets", value: "bracelets", path: "/bracelets", icon: "Bracelet" },
  { label: "New Arrivals", value: "newarrivals", path: "/newarrivals", icon: "Sparkle" },
  { label: "Best Sellers", value: "bestsellers", path: "/bestsellers", icon: "Crown" },
].map((category) => ({
  image: category.image || "",
  icon: category.icon || category.label,
  ...category,
}));

const preparedProducts = seedProducts.map((product) => ({
  hidden: false,
  featured: ["Best Seller", "Premium", "Hot"].includes(product.badge),
  specifications: {
    material: "Premium gold plated alloy",
    finish: "Luxury polish",
    care: "Keep away from perfume and water",
  },
  reviews: [
    { id: `seed-${product.id}-1`, name: "Aarohi", rating: 5, text: "Beautiful finish and very giftable.", approved: true, createdAt: "2026-06-12" },
    { id: `seed-${product.id}-2`, name: "Meera", rating: 4.8, text: "Looks premium and arrived safely packed.", approved: true, createdAt: "2026-06-18" },
  ],
  ...product,
}));

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => readStorage(PRODUCTS_KEY, preparedProducts));
  const [categories, setCategories] = useState(() =>
    readStorage(CATEGORIES_KEY, extendedCategories)
  );

  const fetchBackendCategories = useCallback(async () => {
    try {
      const backendCats = await CategoryService.getCategories({ includeInactive: true });
      if (backendCats && backendCats.length > 0) {
        const formatted = backendCats.map((cat) => ({
          id: cat.id,
          _id: cat.id,
          label: cat.name,
          name: cat.name,
          value: cat.slug,
          slug: cat.slug,
          path: `/${cat.slug}`,
          image: cat.image || "",
          icon: cat.icon || cat.name,
          description: cat.description || "",
        }));
        setCategories(formatted);
        writeStorage(CATEGORIES_KEY, formatted);
      }
    } catch {
      // Keep existing local categories on network error
    }
  }, []);

  const fetchBackendProducts = useCallback(async () => {
    try {
      const res = await ProductService.getProducts({ includeHidden: "true", limit: 100 });
      if (res?.data && res.data.length > 0) {
        setProducts(res.data);
        writeStorage(PRODUCTS_KEY, res.data);
      }
    } catch {
      // Keep existing local products on network error
    }
  }, []);

  useEffect(() => {
    let active = true;
    const initData = async () => {
      try {
        const [backendCats, res] = await Promise.all([
          CategoryService.getCategories({ includeInactive: true }).catch(() => null),
          ProductService.getProducts({ includeHidden: "true", limit: 100 }).catch(() => null),
        ]);
        if (active && backendCats && backendCats.length > 0) {
          const formatted = backendCats.map((cat) => ({
            id: cat.id,
            _id: cat.id,
            label: cat.name,
            name: cat.name,
            value: cat.slug,
            slug: cat.slug,
            path: `/${cat.slug}`,
            image: cat.image || "",
            icon: cat.icon || cat.name,
            description: cat.description || "",
          }));
          setCategories(formatted);
          writeStorage(CATEGORIES_KEY, formatted);
        }
        if (active && res?.data && res.data.length > 0) {
          setProducts(res.data);
          writeStorage(PRODUCTS_KEY, res.data);
        }
      } catch {
        // Keep local state
      }
    };
    initData();
    return () => {
      active = false;
    };
  }, []);

  const persistProducts = useCallback((nextProducts) => {
    setProducts(nextProducts);
    writeStorage(PRODUCTS_KEY, nextProducts);
  }, []);

  const persistCategories = useCallback((nextCategories) => {
    setCategories(nextCategories);
    writeStorage(CATEGORIES_KEY, nextCategories);
  }, []);

  const visibleProducts = useMemo(
    () => products.filter((product) => !product.hidden),
    [products]
  );

  const addProduct = useCallback(
    async (product) => {
      const image = product.images?.[0] || product.image || "";
      const localProduct = {
        id: Date.now(),
        rating: 4.8,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        badge: product.featured ? "Featured" : "New",
        oldPrice: Number(product.oldPrice || product.price || 0),
        discount: Number(product.discount || 0),
        stock: Number(product.stock || 0),
        price: Number(product.price || 0),
        images: product.images?.length ? product.images : [image],
        image,
        hidden: false,
        reviews: [],
        specifications: {},
        ...product,
      };

      try {
        const created = await ProductService.createProduct({
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          discount: product.discount,
          stock: product.stock,
          badge: product.badge,
          category: product.category,
          categorySlug: product.category,
          description: product.description,
          image,
          images: product.images,
          featured: product.featured,
          hidden: false,
        });
        persistProducts([created, ...products]);
      } catch {
        persistProducts([localProduct, ...products]);
      }
    },
    [persistProducts, products]
  );

  const updateProduct = useCallback(
    async (id, updates) => {
      try {
        const updated = await ProductService.updateProduct(id, updates);
        persistProducts(
          products.map((p) => (p.id === id || p._id === id || p.slug === id ? updated : p))
        );
      } catch {
        persistProducts(
          products.map((p) => (p.id === id || p._id === id || p.slug === id ? { ...p, ...updates } : p))
        );
      }
    },
    [persistProducts, products]
  );

  const deleteProduct = useCallback(
    async (id) => {
      try {
        await ProductService.deleteProduct(id);
      } catch {
        // Fallback
      }
      persistProducts(products.filter((p) => p.id !== id && p._id !== id && p.slug !== id));
    },
    [persistProducts, products]
  );

  const toggleProductVisibility = useCallback(
    async (id) => {
      try {
        const updated = await ProductService.toggleVisibility(id);
        persistProducts(
          products.map((p) => (p.id === id || p._id === id || p.slug === id ? updated : p))
        );
      } catch {
        persistProducts(
          products.map((p) =>
            p.id === id || p._id === id || p.slug === id ? { ...p, hidden: !p.hidden } : p
          )
        );
      }
    },
    [persistProducts, products]
  );

  const addCategory = useCallback(
    async (category) => {
      const label = category.label.trim();
      const value = category.value || label.toLowerCase().replace(/[\s\W-]+/g, "");
      const newCat = {
        label,
        name: label,
        value,
        slug: value,
        path: `/${value}`,
        image: category.image || "",
        icon: category.icon || label,
      };

      try {
        const backendCat = await CategoryService.createCategory({
          name: label,
          slug: value,
          image: category.image || "",
          icon: category.icon || label,
        });
        const formatted = {
          id: backendCat.id,
          _id: backendCat.id,
          label: backendCat.name,
          name: backendCat.name,
          value: backendCat.slug,
          slug: backendCat.slug,
          path: `/${backendCat.slug}`,
          image: backendCat.image || "",
          icon: backendCat.icon || backendCat.name,
        };
        persistCategories([...categories, formatted]);
      } catch {
        persistCategories([...categories, newCat]);
      }
    },
    [categories, persistCategories]
  );

  const updateCategory = useCallback(
    async (value, updates) => {
      const match = categories.find((cat) => cat.value === value || cat.id === value || cat.slug === value);
      if (match?.id) {
        try {
          await CategoryService.updateCategory(match.id, {
            name: updates.label || match.label,
            image: updates.image !== undefined ? updates.image : match.image,
            icon: updates.icon !== undefined ? updates.icon : match.icon,
          });
        } catch {
          // Fallback
        }
      }
      persistCategories(
        categories.map((category) =>
          category.value === value || category.id === value ? { ...category, ...updates } : category
        )
      );
    },
    [categories, persistCategories]
  );

  const deleteCategory = useCallback(
    async (value) => {
      const match = categories.find((cat) => cat.value === value || cat.id === value || cat.slug === value);
      if (match?.id) {
        try {
          await CategoryService.deleteCategory(match.id);
        } catch {
          // Fallback
        }
      }
      persistCategories(categories.filter((category) => category.value !== value && category.id !== value));
    },
    [categories, persistCategories]
  );

  const addReview = useCallback(
    (productId, review) => {
      const nextReview = {
        id: `review-${Date.now()}`,
        name: review.name?.trim() || "Customer",
        rating: Number(review.rating || 5),
        text: review.text.trim(),
        approved: false,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      persistProducts(
        products.map((product) =>
          product.id === productId || product._id === productId || product.slug === productId
            ? { ...product, reviews: [nextReview, ...(product.reviews || [])] }
            : product
        )
      );
      return nextReview;
    },
    [persistProducts, products]
  );

  const toggleReviewApproval = useCallback(
    (productId, reviewId) => {
      persistProducts(
        products.map((product) =>
          product.id === productId || product._id === productId || product.slug === productId
            ? {
                ...product,
                reviews: (product.reviews || []).map((review, index) =>
                  (review.id || `legacy-${product.id}-${index}`) === reviewId
                    ? { ...review, approved: review.approved === false }
                    : review
                ),
              }
            : product
        )
      );
    },
    [persistProducts, products]
  );

  const deleteReview = useCallback(
    (productId, reviewId) => {
      persistProducts(
        products.map((product) =>
          product.id === productId || product._id === productId || product.slug === productId
            ? {
                ...product,
                reviews: (product.reviews || []).filter(
                  (review, index) => (review.id || `legacy-${product.id}-${index}`) !== reviewId
                ),
              }
            : product
        )
      );
    },
    [persistProducts, products]
  );

  const value = useMemo(
    () => ({
      products,
      visibleProducts,
      categories,
      fetchBackendCategories,
      fetchBackendProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductVisibility,
      addCategory,
      updateCategory,
      deleteCategory,
      addReview,
      toggleReviewApproval,
      deleteReview,
    }),
    [
      addCategory,
      addProduct,
      addReview,
      categories,
      deleteCategory,
      deleteProduct,
      deleteReview,
      fetchBackendCategories,
      fetchBackendProducts,
      products,
      toggleProductVisibility,
      toggleReviewApproval,
      updateCategory,
      updateProduct,
      visibleProducts,
    ]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }
  return context;
}
