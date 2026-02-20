import api from "@/services/api";

const myPropertiesAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/module/resident/config/my/properties");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (propertyId) => {
    try {
      const response = await api.get(`/module/resident/config/my/property/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default myPropertiesAPI;
