/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage";
import { SettingsService } from "../services/settings.service";

const StoreContext = createContext(null);
const STORE_SETTINGS_KEY = "love2bazzar_store_settings";

const defaultSettings = {
  storeName: "Love2Bazzar",
  email: "love2bazzar@gmail.com",
  phone: "+91 6374253665",
  address: "No.18, Golden City, Pettai, Tirunelveli - 627004",
  announcement: "Free shipping above Rs. 499",
  shippingThreshold: 499,
  shippingCharge: 79,
  primaryColor: "#D4AF37",
};

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(() => readStorage(STORE_SETTINGS_KEY, defaultSettings));

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const backendSettings = await SettingsService.getSettings();
        if (active && backendSettings) {
          const merged = {
            ...defaultSettings,
            ...backendSettings,
            announcement: backendSettings.announcementText || defaultSettings.announcement,
          };
          setSettings(merged);
          writeStorage(STORE_SETTINGS_KEY, merged);
        }
      } catch {
        // Keep local state
      }
    };
    fetchSettings();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--gold", settings.primaryColor || defaultSettings.primaryColor);
    document.title = `${settings.storeName || defaultSettings.storeName} | Jewellery & Gifts`;
  }, [settings.primaryColor, settings.storeName]);

  const updateSettings = useCallback(async (updates) => {
    const nextSettings = {
      ...defaultSettings,
      ...updates,
      shippingThreshold: Number(updates.shippingThreshold ?? defaultSettings.shippingThreshold),
      shippingCharge: Number(updates.shippingCharge ?? defaultSettings.shippingCharge),
    };
    setSettings(nextSettings);
    writeStorage(STORE_SETTINGS_KEY, nextSettings);

    try {
      await SettingsService.updateSettings({
        storeName: updates.storeName,
        email: updates.email,
        phone: updates.phone,
        address: updates.address,
        announcementText: updates.announcement,
        shippingThreshold: updates.shippingThreshold,
        shippingCharge: updates.shippingCharge,
        primaryColor: updates.primaryColor,
      });
    } catch {
      // Fallback
    }
  }, []);

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
