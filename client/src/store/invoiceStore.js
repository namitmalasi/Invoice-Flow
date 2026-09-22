import { create } from "zustand";
import api from "../services/api";

const useInvoiceStore = create((set) => ({
  invoices: [],
  loading: false,
  error: null,

  fetchInvoices: async () => {
    try {
      set({ loading: true, error: null });

      const response = await api.get("/invoices");

      set({
        invoices: response.data.invoices,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch invoices",
      });
    }
  },

  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post("/invoices", invoiceData);

      set((state) => ({
        invoices: [response.data.invoice, ...state.invoices],
      }));

      return response.data.invoice;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create invoice",
      );
    }
  },

  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await api.put(`/invoices/${id}`, invoiceData);

      set((state) => ({
        invoices: state.invoices.map((invoice) =>
          invoice._id === id ? response.data.invoice : invoice,
        ),
      }));

      return response.data.invoice;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update invoice",
      );
    }
  },

  deleteInvoice: async (id) => {
    try {
      await api.delete(`/invoices/${id}`);

      set((state) => ({
        invoices: state.invoices.filter((invoice) => invoice._id !== id),
      }));
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete invoice",
      );
    }
  },
}));

export default useInvoiceStore;
