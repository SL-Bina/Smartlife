import api from "@/services/api";

export const blockLookupsAPI = {

  getMtks: async () => {
    try {
      const res = await api.get("/module/mtks/list", { params: { per_page: 1000 } });
      return res.data?.data?.data || [];
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getComplexes: async (params = {}) => {
    try {
      const res = await api.get("/module/complexes/list", { params: { per_page: 1000, ...params } });
      return res.data?.data?.data || [];
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getBuildings: async (params = {}) => {
    try {
      const res = await api.get("/module/buildings/list", { params: { per_page: 1000, ...params } });
      return res.data?.data?.data || [];
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
};

export default blockLookupsAPI;

