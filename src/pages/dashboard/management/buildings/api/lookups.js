import api from "@/services/api";

export const buildingLookupsAPI = {
  getComplexes: async (params = {}) => {
    try {
      const res = await api.get("/module/complexes/list", { params: { per_page: 1000, ...params } });
      return res.data?.data?.data || [];
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
};

export default buildingLookupsAPI;

