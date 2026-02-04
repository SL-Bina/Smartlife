import api from "@/services/api";

export const lookupsAPI = {
  getMtks: async (params = {}) => {
    try {
      const res = await api.get("/module/mtk/list", {
        params, 
      });
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getComplexes: async (params = {}) => {
    try {
      const res = await api.get("/module/complexes/list", {
        params, 
      });
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getBuildings: async (params = {}) => {
    try {
      const res = await api.get("/module/buildings/list", {
        params, 
      });
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getBlocks: async (params = {}) => {
    try {
      const res = await api.get("/module/blocks/list", {
        params, 
      });
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
};

export default lookupsAPI;
