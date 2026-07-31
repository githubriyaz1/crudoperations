/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { showToast } from "../utils/toast";
import { readStorage, writeStorage } from "../utils/storage";
import { useAuth } from "./AuthContext";
import { WishlistService } from "../services/wishlist.service";

const WishlistContext = createContext(null);
const WISHLIST_KEY = "love2bazzar_wishlist";

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => readStorage(WISHLIST_KEY, []));
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const loadWishlist = async () => {
      try {
        const items = await WishlistService.getWishlist();
        if (active && items) {
          setWishlistItems(items);
          writeStorage(WISHLIST_KEY, items);
        }
      } catch {
        // Keep local state
      }
    };
    loadWishlist();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const isWishlisted = useCallback(
    (id) =>
      wishlistItems.some(
        (item) => item.id === id || item._id === id || item.slug === id
      ),
    [wishlistItems]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      const pId = product.slug || product._id || product.id;
      const alreadyIn = wishlistItems.some(
        (item) => item.id === pId || item._id === pId || item.slug === pId
      );

      if (alreadyIn) {
        const next = wishlistItems.filter(
          (item) => item.id !== pId && item._id !== pId && item.slug !== pId
        );
        setWishlistItems(next);
        writeStorage(WISHLIST_KEY, next);
        showToast("Removed from wishlist");
      } else {
        const next = [...wishlistItems, product];
        setWishlistItems(next);
        writeStorage(WISHLIST_KEY, next);
        showToast("Added to wishlist");
      }

      if (isAuthenticated && pId) {
        try {
          const updated = await WishlistService.toggleWishlist(pId);
          if (updated) {
            setWishlistItems(updated);
            writeStorage(WISHLIST_KEY, updated);
          }
        } catch {
          // Local fallback retained
        }
      }
    },
    [isAuthenticated, wishlistItems]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isWishlisted,
      toggleWishlist,
    }),
    [isWishlisted, toggleWishlist, wishlistItems]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
}
