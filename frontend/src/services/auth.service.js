import { api, clearAccessToken, setAccessToken } from "./api";

export const AuthService = {
  async register(payload) {
    const response = await api.post("/auth/register", payload);
    const { user, accessToken } = response.data.data;
    setAccessToken(accessToken);
    return { user, accessToken };
  },

  async login(payload) {
    const response = await api.post("/auth/login", payload);
    const { user, accessToken } = response.data.data;
    setAccessToken(accessToken);
    return { user, accessToken };
  },

  async refresh() {
    const response = await api.post("/auth/refresh");
    const { user, accessToken } = response.data.data;
    setAccessToken(accessToken);
    return { user, accessToken };
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAccessToken();
    }
  },

  async getMe() {
    const response = await api.get("/auth/me");
    return response.data.data.user;
  },

  async updateMe(payload) {
    const response = await api.patch("/auth/me", payload);
    return response.data.data.user;
  },
};
