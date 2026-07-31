import mongoose from "mongoose";

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Love2Bazzar" },
    email: { type: String, default: "support@love2bazzar.com" },
    phone: { type: String, default: "+91 98765 43210" },
    address: { type: String, default: "Jaipur Jewellery Market, Rajasthan, India" },
    announcementText: { type: String, default: "Flat 10% OFF on First Order | Code: WELCOME10" },
    announcementActive: { type: Boolean, default: true },
    shippingThreshold: { type: Number, default: 999 },
    shippingCharge: { type: Number, default: 99 },
    primaryColor: { type: String, default: "#d4af37" },
  },
  { timestamps: true }
);

export const StoreSettings = mongoose.model("StoreSettings", storeSettingsSchema);
