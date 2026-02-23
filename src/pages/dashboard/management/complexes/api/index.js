import api from "@/services/api";

export const complexesAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/complexes/list", { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/complexes/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  add: async (complexData) => {
    try {
      const response = await api.put("/module/complexes/add", complexData);
      return response;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
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

  update: async (id, complexData) => {
    try {
      const response = await api.patch(`/module/complexes/${id}`, complexData);
      return response;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
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
      const response = await api.delete(`/module/complexes/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  search: async (params = {}) => {
    try {
      // Build URLSearchParams to ensure proper formatting
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        // Array parameter: mtk_ids[]
        if (key === 'mtk_ids' && Array.isArray(params[key]) && params[key].length > 0) {
          params[key].forEach((id) => {
            if (id !== null && id !== undefined && id !== '') {
              searchParams.append(`${key}[]`, String(id));
            }
          });
        } 
        // Single value parameters: name, status, phone, email, etc.
        else if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          searchParams.append(key, String(params[key]));
        }
      });
      const response = await api.get(`/search/module/complex?${searchParams.toString()}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateConfig: async (id, configData) => {
    try {
      const response = await api.patch(`/module/complexes/config/${id}`, configData);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default complexesAPI;

