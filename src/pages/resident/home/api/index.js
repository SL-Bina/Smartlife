import api from "@/services/api";

export const residentHomeAPI = {
  getStats: async () => {
    try {
      const response = await api.get("/module/resident/config/home/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default residentHomeAPI;

