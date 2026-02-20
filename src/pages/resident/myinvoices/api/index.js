import api from "@/services/api";

export const residentInvoicesAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/resident/config/my/invoices", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getById: async (invoiceId) => {
    try {
      const response = await api.get(`/module/resident/config/my/invoice/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default residentInvoicesAPI;

