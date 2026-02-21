import api from "@/services/api";

const INVOICES_BASE = "/module/resident/config/my";

export const residentInvoicesAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get(`${INVOICES_BASE}/invoices`, { params });
      return response?.data ?? response;
    } catch (error) {
      if (error?.response?.status === 404) {
        return { success: false, data: [] };
      }
      throw error.response?.data || error;
    }
  },
  getById: async (invoiceId) => {
    try {
      const response = await api.get(`${INVOICES_BASE}/invoices/${invoiceId}`);
      return response?.data ?? response;
    } catch (error) {
      if (error?.response?.status === 404) {
        return { success: false, data: null };
      }
      throw error.response?.data || error;
    }
  },
};

export default residentInvoicesAPI;

