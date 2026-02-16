import api from "@/services/api";

const mtkAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/mtk/list", { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  search: async (searchParams = {}) => {
    try {
      // Build URLSearchParams to ensure proper formatting
      const urlParams = new URLSearchParams();
      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key] !== null && searchParams[key] !== undefined && searchParams[key] !== '') {
          urlParams.append(key, String(searchParams[key]));
        }
      });
      const response = await api.get(`/search/module/mtk?${urlParams.toString()}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/mtk/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  add: async (mtkData) => {
    try {
      const response = await api.put("/mtk/add", mtkData);
      return response;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        // Flatten validation errors
        let errorMessage = "";
        try {
          const errors = Object.values(errorData.errors).flat().join(", ");
          errorMessage = errors || errorData.message || "Validation error";
        } catch (e) {
          errorMessage = errorData.message || "Validation error";
        }
        throw new Error(errorMessage);
      }
      throw error.response?.data || error.message;
    }
  },

  update: async (id, mtkData) => {
    try {
      const response = await api.patch(`/mtk/${id}`, mtkData);
      return response;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        // Flatten validation errors
        let errorMessage = "";
        try {
          const errors = Object.values(errorData.errors).flat().join(", ");
          errorMessage = errors || errorData.message || "Validation error";
        } catch (e) {
          errorMessage = errorData.message || "Validation error";
        }
        throw new Error(errorMessage);
      }
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/mtk/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default mtkAPI;

