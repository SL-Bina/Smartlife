import api from "@/services/api";

export const userLookupsAPI = {
  getRoles: async () => {
    try {
      const res = await api.get("/module/roles/list", { params: { per_page: 1000 } });
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getModules: async () => {
    try {
      const res = await api.get("/module/permissions/list", { params: { per_page: 1000 } });
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

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

export default userLookupsAPI;

