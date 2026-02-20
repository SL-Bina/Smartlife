import api from "@/services/api";

export const residentTicketsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/resident/config/my/tickets", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getById: async (ticketId) => {
    try {
      const response = await api.get(`/module/resident/config/my/ticket/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post("/module/resident/config/my/ticket", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default residentTicketsAPI;

