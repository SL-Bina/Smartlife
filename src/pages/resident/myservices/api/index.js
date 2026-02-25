import api from "@/services/api";

const myServicesAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/module/resident/config/my/services");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (serviceId) => {
    try {
      const response = await api.get(`/module/resident/config/my/service/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  requestService: async (serviceData) => {
    try {
      const response = await api.post("/module/resident/config/my/service/request", serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  cancelService: async (serviceId) => {
    try {
      const response = await api.delete(`/module/resident/config/my/service/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default myServicesAPI;