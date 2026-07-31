import { api } from "./api";

export const SearchService = {
  async search(params = {}) {
    const response = await api.get("/search", { params });
    return response.data;
  },

  async getSuggestions(query = "") {
    const response = await api.get("/search/suggestions", { params: { q: query } });
    return response.data.data;
  },
};
