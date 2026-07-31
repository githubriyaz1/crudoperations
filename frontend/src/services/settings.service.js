import { api } from "./api";

export const SettingsService = {
  async getSettings() {
    const response = await api.get("/settings");
    return response.data.data.settings;
  },

  async updateSettings(payload) {
    const response = await api.patch("/settings", payload);
    return response.data.data.settings;
  },
};
