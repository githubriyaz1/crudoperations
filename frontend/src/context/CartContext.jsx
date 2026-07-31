/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { showToast } from "../utils/toast";
import { readStorage, writeStorage } from "../utils/storage";
import { useStore } from "./StoreContext";
import { CartService } from "../services/cart.service";

const CartContext = createContext(null);
const CART_KEY = "love2bazzar_cart";

export function CartProvider({ children }) {
  const { settings } = useStore();
  const [cartItems, setCartItems] = useState(() => readStorage(CART_KEY, []));

  useEffect(() => {
    let active = true;
    const fetchBackendCart = async () => {
      try {
        const cartData = await CartService.getCart();
        if (active && cartData?.items) {
          setCartItems(cartData.items);
          writeStorage(CART_KEY, cartData.items);
        }
      } catch {
        // Keep local cart on failure
      }
    };
    fetchBackendCart();
    return () => {
      active = false;
    };
  }, []);

  const persistCart = useCallback((nextItems) => {
    setCartItems(nextItems);
    writeStorage(CART_KEY, nextItems);
  }, []);

  const addToCart = useCallback(async (product, quantity = 1) => {
    const pId = product.slug || product._id || product.id;
    setCartItems((items) => {
      const existing = items.find((item) => item.id === pId || item.productId === pId);
      let nextItems;
      if (existing) {
        nextItems = items.map((item) =>
          item.id === pId || item.productId === pId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        nextItems = [...items, { ...product, id: pId, quantity }];
      }
      writeStorage(CART_KEY, nextItems);
      showToast("Added to cart");
      return nextItems;
    });

    try {
      const updatedCart = await CartService.addItem(pId, quantity, product.bundleMetadata);
      if (updatedCart?.items) {
        setCartItems(updatedCart.items);
        writeStorage(CART_KEY, updatedCart.items);
      }
    } catch {
      // Fallback retained
    }
  }, []);

  const removeFromCart = useCallback(async (id) => {
    setCartItems((items) => {
      const nextItems = items.filter(
        (item) => item.id !== id && item.productId !== id && item._id !== id
      );
      writeStorage(CART_KEY, nextItems);
      return nextItems;
    });

    try {
      const updatedCart = await CartService.removeItem(id);
      if (updatedCart?.items) {
        setCartItems(updatedCart.items);
        writeStorage(CART_KEY, updatedCart.items);
      }
    } catch {
      // Fallback retained
    }
  }, []);

  const updateQuantity = useCallback(
    async (id, quantity) => {
      if (quantity < 1) {
        removeFromCart(id);
        return;
      }

      setCartItems((items) => {
        const nextItems = items.map((item) =>
          item.id === id || item.productId === id || item._id === id
            ? { ...item, quantity }
            : item
        );
        writeStorage(CART_KEY, nextItems);
        return nextItems;
      });

      try {
        const updatedCart = await CartService.updateQuantity(id, quantity);
        if (updatedCart?.items) {
          setCartItems(updatedCart.items);
          writeStorage(CART_KEY, updatedCart.items);
        }
      } catch {
        // Fallback retained
      }
    },
    [removeFromCart]
  );

  const clearCart = useCallback(async () => {
    persistCart([]);
    try {
      await CartService.clearCart();
    } catch {
      // Fallback
    }
  }, [persistCart]);

  const value = useMemo(() => {
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    );
    const shipping =
      subtotal > 0 && subtotal < Number(settings.shippingThreshold)
        ? Number(settings.shippingCharge)
        : 0;
    const total = subtotal + shipping;

    return {
      cartItems,
      cartCount,
      subtotal,
      shipping,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    };
  }, [addToCart, cartItems, clearCart, removeFromCart, settings.shippingCharge, settings.shippingThreshold, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
