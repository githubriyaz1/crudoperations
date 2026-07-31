import { StoreSettings } from "../../../models/StoreSettings.model.js";

export const SettingsService = {
  async getSettings() {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({});
    }
    return settings;
  },

  async updateSettings(payload) {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create(payload);
    } else {
      if (payload.storeName !== undefined) settings.storeName = payload.storeName.trim();
      if (payload.email !== undefined) settings.email = payload.email.trim();
      if (payload.phone !== undefined) settings.phone = payload.phone.trim();
      if (payload.address !== undefined) settings.address = payload.address.trim();
      if (payload.announcementText !== undefined) settings.announcementText = payload.announcementText.trim();
      if (payload.announcementActive !== undefined) settings.announcementActive = Boolean(payload.announcementActive);
      if (payload.shippingThreshold !== undefined) settings.shippingThreshold = Number(payload.shippingThreshold);
      if (payload.shippingCharge !== undefined) settings.shippingCharge = Number(payload.shippingCharge);
      if (payload.primaryColor !== undefined) settings.primaryColor = payload.primaryColor.trim();

      await settings.save();
    }
    return settings;
  },
};
