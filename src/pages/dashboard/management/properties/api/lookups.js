import api from "@/services/api";

export const lookupsAPI = {
  getMtks: async () => {
    try {
      const res = await api.get("/module/mtk/list");
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getComplexes: async () => {
    try {
      const res = await api.get("/module/complexes/list");
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getBuildings: async () => {
    try {
      // Əgər backend-də başqa route varsa, buranı dəyiş
      const res = await api.get("/module/buildings/list");
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getBlocks: async () => {
    try {
      // Əgər backend-də başqa route varsa, buranı dəyiş
      const res = await api.get("/module/blocks/list");
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
};

export default lookupsAPI;
