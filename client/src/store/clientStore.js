import { create } from "zustand";
import api from "../services/api";

const useClientStore = create((set) => ({
  clients: [],
  loading: false,
  error: null,

  fetchClients: async () => {
    try {
      set({ loading: true, error: null });

      const response = await api.get("/clients");

      set({
        clients: response.data.clients,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch clients",
      });
    }
  },

  createClient: async (clientData) => {
    try {
      const response = await api.post("/clients", clientData);

      set((state) => ({
        clients: [response.data.client, ...state.clients],
      }));

      return response.data.client;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create client"
      );
    }
  },

  updateClient: async (id, clientData) => {
    try {
      const response = await api.put(`/clients/${id}`, clientData);

      set((state) => ({
        clients: state.clients.map((client) =>
          client._id === id ? response.data.client : client
        ),
      }));

      return response.data.client;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update client"
      );
    }
  },

  deleteClient: async (id) => {
    try {
      await api.delete(`/clients/${id}`);

      set((state) => ({
        clients: state.clients.filter((client) => client._id !== id),
      }));
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete client"
      );
    }
  },
}));

export default useClientStore;