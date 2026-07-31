import { api } from "./api";

export const NewsletterService = {
  async subscribe(email) {
    const response = await api.post("/newsletter/subscribe", { email });
    return response.data;
  },

  async getSubscribers() {
    const response = await api.get("/newsletter/subscribers");
    return response.data.data.subscribers;
  },
};
