import api from "@/services/api";

const BASE = "/module/resident/config/my";

export const residentHomeAPI = {
  getProperties: async () => {
    try {
      const response = await api.get(`${BASE}/properties`);
      return response?.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getInvoices: async () => {
    try {
      const response = await api.get(`${BASE}/invoices`);
      return response?.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default residentHomeAPI;

