import api from "@/services/api";

export const servicesLookupsAPI = {
  getMtks: async () => {
    try {
      const res = await api.get("/module/mtk/list");
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getComplexes: async (params = {}) => {
    try {
      const res = await api.get("/module/complexes/list", { params });
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
};

export default servicesLookupsAPI;
