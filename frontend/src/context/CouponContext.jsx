/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage";
import { CouponService } from "../services/coupon.service";
import { useAuth } from "./AuthContext";

const CouponContext = createContext(null);
const COUPONS_KEY = "love2bazzar_coupons";

const seedCoupons = [
  {
    id: "welcome-10",
    code: "WELCOME10",
    description: "10% off on your first jewellery order",
    discountType: "percentage",
    value: 10,
    minimumOrder: 799,
    maxDiscount: 250,
    usageLimit: 0,
    usageCount: 0,
    active: true,
  },
  {
    id: "gift-150",
    code: "GIFT150",
    description: "Rs. 150 off on gift-ready orders",
    discountType: "fixed",
    value: 150,
    minimumOrder: 1499,
    maxDiscount: 0,
    usageLimit: 0,
    usageCount: 0,
    active: true,
  },
];

export function CouponProvider({ children }) {
  const [coupons, setCoupons] = useState(() => readStorage(COUPONS_KEY, seedCoupons));
  const { isAdmin } = useAuth();

  useEffect(() => {
    let active = true;
    const fetchBackendCoupons = async () => {
      if (!isAdmin) return;
      try {
        const backendCoupons = await CouponService.getCoupons();
        if (active && backendCoupons && backendCoupons.length > 0) {
          const formatted = backendCoupons.map((c) => ({
            id: c.id,
            _id: c.id,
            code: c.code,
            description: c.discountPercent ? `${c.discountPercent}% off` : `Rs. ${c.discountAmount} off`,
            discountType: c.discountPercent ? "percentage" : "fixed",
            value: c.discountPercent || c.discountAmount || 0,
            minimumOrder: c.minSpend || 0,
            maxDiscount: c.maxDiscount || 0,
            usageLimit: c.usageLimit || 0,
            usageCount: c.usedCount || 0,
            active: c.isActive,
          }));
          setCoupons(formatted);
          writeStorage(COUPONS_KEY, formatted);
        }
      } catch {
        // Keep local state
      }
    };
    fetchBackendCoupons();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const persistCoupons = useCallback((nextCoupons) => {
    setCoupons(nextCoupons);
    writeStorage(COUPONS_KEY, nextCoupons);
  }, []);

  const addCoupon = useCallback(
    async (coupon) => {
      const code = coupon.code.trim().toUpperCase();
      try {
        const created = await CouponService.createCoupon({
          code,
          discountPercent: coupon.discountType === "percentage" ? coupon.value : 0,
          discountAmount: coupon.discountType === "fixed" ? coupon.value : 0,
          minSpend: coupon.minimumOrder || 0,
          maxDiscount: coupon.maxDiscount || 0,
          isActive: coupon.active !== false,
          usageLimit: coupon.usageLimit || 100,
        });
        const formatted = {
          id: created.id,
          _id: created.id,
          code: created.code,
          description: created.discountPercent ? `${created.discountPercent}% off` : `Rs. ${created.discountAmount} off`,
          discountType: created.discountPercent ? "percentage" : "fixed",
          value: created.discountPercent || created.discountAmount || 0,
          minimumOrder: created.minSpend || 0,
          maxDiscount: created.maxDiscount || 0,
          usageLimit: created.usageLimit || 0,
          usageCount: created.usedCount || 0,
          active: created.isActive,
        };
        persistCoupons([formatted, ...coupons]);
        return { ok: true, coupon: formatted };
      } catch (err) {
        return { ok: false, message: err.response?.data?.message || "Failed to create coupon." };
      }
    },
    [coupons, persistCoupons]
  );

  const updateCoupon = useCallback(
    async (id, updates) => {
      try {
        const updated = await CouponService.updateCoupon(id, {
          code: updates.code,
          discountPercent: updates.discountType === "percentage" ? updates.value : 0,
          discountAmount: updates.discountType === "fixed" ? updates.value : 0,
          minSpend: updates.minimumOrder,
          maxDiscount: updates.maxDiscount,
          isActive: updates.active,
        });
        persistCoupons(
          coupons.map((c) => (c.id === id || c._id === id ? { ...c, ...updates } : c))
        );
        return { ok: true, coupon: updated };
      } catch (err) {
        return { ok: false, message: err.response?.data?.message || "Failed to update coupon." };
      }
    },
    [coupons, persistCoupons]
  );

  const deleteCoupon = useCallback(
    async (id) => {
      try {
        await CouponService.deleteCoupon(id);
      } catch {
        // Fallback
      }
      persistCoupons(coupons.filter((c) => c.id !== id && c._id !== id));
    },
    [coupons, persistCoupons]
  );

  const toggleCoupon = useCallback(
    async (id) => {
      try {
        await CouponService.toggleCoupon(id);
      } catch {
        // Fallback
      }
      persistCoupons(
        coupons.map((c) => (c.id === id || c._id === id ? { ...c, active: !c.active } : c))
      );
    },
    [coupons, persistCoupons]
  );

  const validateCoupon = useCallback(
    async (code, subtotal) => {
      try {
        const res = await CouponService.validateCoupon(code, subtotal);
        if (res?.valid) {
          return { valid: true, coupon: res.coupon, discount: res.discount };
        }
      } catch (err) {
        return {
          valid: false,
          message: err.response?.data?.message || "Invalid coupon code.",
        };
      }

      // Local fallback
      const coupon = coupons.find(
        (item) => item.code === code.trim().toUpperCase()
      );
      if (!coupon) return { valid: false, message: "Coupon code not found." };
      if (!coupon.active) return { valid: false, message: "This coupon is inactive." };
      if (subtotal < coupon.minimumOrder) {
        return {
          valid: false,
          message: `Add Rs. ${coupon.minimumOrder - subtotal} more to apply this coupon.`,
        };
      }
      const raw = coupon.discountType === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
      const discount = Math.min(raw, subtotal);
      return { valid: true, coupon, discount };
    },
    [coupons]
  );

  const redeemCoupon = useCallback(
    (id) =>
      persistCoupons(
        coupons.map((coupon) =>
          coupon.id === id ? { ...coupon, usageCount: (coupon.usageCount || 0) + 1 } : coupon
        )
      ),
    [coupons, persistCoupons]
  );

  const value = useMemo(
    () => ({
      coupons,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      toggleCoupon,
      validateCoupon,
      redeemCoupon,
    }),
    [addCoupon, coupons, deleteCoupon, redeemCoupon, toggleCoupon, updateCoupon, validateCoupon]
  );

  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>;
}

export function useCoupons() {
  const context = useContext(CouponContext);
  if (!context) throw new Error("useCoupons must be used inside CouponProvider");
  return context;
}
