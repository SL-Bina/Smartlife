import api from "@/services/api";

export const complexLookupsAPI = {
  getMtks: async () => {
    try {
      const res = await api.get("/module/mtk/list", { params: { per_page: 1000 } });
      return res.data?.data?.data || [];
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getModules: async () => {
    try {
      const res = await api.get("/module/permissions/list", { params: { per_page: 1000 } });
      return res.data?.data?.data || [];
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
};

export default complexLookupsAPI;

