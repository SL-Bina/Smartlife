import api from "@/services/api";
import propertiesAPI from "./index";

export const propertyLookupsAPI = {
  getMtks: async () => {
    try {
      const res = await api.get("/module/mtk/list", { params: { per_page: 1000 } });
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

  getBlocks: async (params = {}) => {
    try {
      const res = await api.get("/module/blocks/list", { params: { per_page: 1000, ...params } });
      return res.data?.data?.data || [];
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getPropertyTypes: async () => {
    try {
      return await propertiesAPI.getTypes();
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },

  getSearchData: async (type, ids = []) => {
    try {
      return await propertiesAPI.getSearchData(type, ids);
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
};

export default propertyLookupsAPI;

