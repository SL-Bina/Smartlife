import api from "@/services/api";

const BASE = "/module/resident/config/my";

export const residentInvoicesAPI = {
  // GET /module/resident/config/my/invoices  — all invoices (no property filter)
  getAll: async (params = {}) => {
    try {
      const response = await api.get(`${BASE}/invoices`, { params });
      return response?.data ?? response;
    } catch (error) {
      if (error?.response?.status === 404) return { success: false, data: [] };
      throw error.response?.data || error;
    }
  },

  // GET /module/resident/config/my/invoice/:property_id  — invoices for a specific property
  getByProperty: async (propertyId, params = {}) => {
    try {
      const response = await api.get(`${BASE}/invoice/${propertyId}`, { params });
      return response?.data ?? response;
    } catch (error) {
      if (error?.response?.status === 404) return { success: false, data: [] };
      throw error.response?.data || error;
    }
  },

  // GET /module/resident/config/my/invoice/detail/:id  — single invoice detail
  getDetail: async (invoiceId) => {
    try {
      const response = await api.get(`${BASE}/invoice/detail/${invoiceId}`);
      return response?.data ?? response;
    } catch (error) {
      if (error?.response?.status === 404) return { success: false, data: null };
      throw error.response?.data || error;
    }
  },
};

export default residentInvoicesAPI;

