import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);

    set({
      user: response.data.user,
    });

    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    set({
      user: response.data.user,
    });

    return response.data;
  },

  logout: async () => {
    await api.post("/auth/logout");

    set({
      user: null,
    });
  },

  fetchUser: async () => {
    try {
      const response = await api.get("/users/me");

      set({
        user: response.data.user,
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        loading: false,
      });
    }
  },
}));

export default useAuthStore;
