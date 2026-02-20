import api from "@/services/api";

export const residentEDocumentsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/resident/config/my/documents", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getById: async (documentId) => {
    try {
      const response = await api.get(`/module/resident/config/my/document/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  download: async (documentId) => {
    try {
      const response = await api.get(`/module/resident/config/my/document/${documentId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default residentEDocumentsAPI;

