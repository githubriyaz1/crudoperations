/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage";
import { OrderService } from "../services/order.service";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);
const ORDERS_KEY = "love2bazzar_orders";

const demoOrders = [
  {
    id: "L2B-1001",
    customer: "Aarohi Sharma",
    email: "aarohi@example.com",
    phone: "9876500011",
    items: [{ name: "Celeste Gold Ring", quantity: 1, price: 1499 }],
    payment: "Razorpay",
    address: "Jaipur, Rajasthan 302001",
    status: "Processing",
    date: "2026-06-28",
    total: 1499,
  },
  {
    id: "L2B-1002",
    customer: "Meera Kapoor",
    email: "meera@example.com",
    phone: "9876500012",
    items: [{ name: "Signature Gift Box", quantity: 1, price: 3499 }],
    payment: "UPI",
    address: "Mumbai, Maharashtra 400001",
    status: "Shipped",
    date: "2026-06-29",
    total: 3499,
  },
];

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => readStorage(ORDERS_KEY, demoOrders));
  const { currentUser, isAdmin } = useAuth();

  const fetchOrders = useCallback(async () => {
    try {
      if (isAdmin) {
        const res = await OrderService.getAllOrders({ limit: 100 });
        if (res?.data) {
          setOrders(res.data);
          writeStorage(ORDERS_KEY, res.data);
        }
      } else if (currentUser?.email) {
        const userOrders = await OrderService.getMyOrders(currentUser.email);
        if (userOrders) {
          setOrders(userOrders);
          writeStorage(ORDERS_KEY, userOrders);
        }
      }
    } catch {
      // Keep local state
    }
  }, [currentUser, isAdmin]);

  useEffect(() => {
    let active = true;
    const loadOrders = async () => {
      try {
        if (isAdmin) {
          const res = await OrderService.getAllOrders({ limit: 100 });
          if (active && res?.data) {
            setOrders(res.data);
            writeStorage(ORDERS_KEY, res.data);
          }
        } else if (currentUser?.email) {
          const userOrders = await OrderService.getMyOrders(currentUser.email);
          if (active && userOrders) {
            setOrders(userOrders);
            writeStorage(ORDERS_KEY, userOrders);
          }
        }
      } catch {
        // Keep local state
      }
    };
    loadOrders();
    return () => {
      active = false;
    };
  }, [currentUser?.email, isAdmin]);

  const persistOrders = useCallback((nextOrders) => {
    setOrders(nextOrders);
    writeStorage(ORDERS_KEY, nextOrders);
  }, []);

  const createOrder = useCallback(
    async (payload) => {
      const { customer, email, phone, address, items, payment, total, coupon = null } = payload;
      const localOrder = {
        id: `L2B-${Date.now().toString().slice(-6)}`,
        customer: customer || payload.name,
        email,
        phone,
        address: typeof address === "string" ? address : address.address || "",
        items,
        payment: payment || payload.paymentMethod || "COD",
        coupon,
        total,
        status: "Processing",
        date: new Date().toISOString().slice(0, 10),
      };

      try {
        const created = await OrderService.checkout({
          name: customer || payload.name,
          email,
          phone,
          address,
          items,
          paymentMethod: payment || payload.paymentMethod || "COD",
          couponCode: coupon?.code || coupon || "",
        });
        persistOrders([created, ...orders]);
        return created;
      } catch {
        persistOrders([localOrder, ...orders]);
        return localOrder;
      }
    },
    [orders, persistOrders]
  );

  const updateOrderStatus = useCallback(
    async (id, status) => {
      try {
        const updated = await OrderService.updateOrderStatus(id, status);
        persistOrders(
          orders.map((order) => (order.id === id || order.orderNumber === id ? updated : order))
        );
      } catch {
        persistOrders(
          orders.map((order) => (order.id === id || order.orderNumber === id ? { ...order, status } : order))
        );
      }
    },
    [orders, persistOrders]
  );

  const value = useMemo(
    () => ({ orders, createOrder, updateOrderStatus, fetchOrders }),
    [createOrder, fetchOrders, orders, updateOrderStatus]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used inside OrdersProvider");
  }
  return context;
}
