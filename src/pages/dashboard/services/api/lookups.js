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

  // ✅ Complex LIST həmişə sərbəst (filter-siz)
  getComplexes: async (params = {}) => {
    try {
      // Burda params saxlayırıq ki, gələcəkdə axtarış/filter əlavə etmək istəsən rahat olsun.
      const res = await api.get("/module/complexes/list", { params });
      return res.data;
    } catch (e) {
      throw e.response?.data || e.message;
    }
  },
};

export default servicesLookupsAPI;
