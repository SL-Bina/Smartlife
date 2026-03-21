import api from "@/services/api";

const BASE = "/module/complexes";
const SEARCH_BASE = "/search/module/complex";

export const complexesAPI = {
  getLookupList: async (params = {}) => {
    try {
      const response = await api.get(`${BASE}/list`, { params });
      return response?.data?.data?.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getModules: async (params = {}) => {
    try {
      const response = await api.get(`/module/permissions/list`, { params });
      return response?.data?.data?.data || response?.data?.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAll: async (params = {}) => {
    try {
      const response = await api.get(`${BASE}/list`, { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`${BASE}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  add: async (complexData) => {
    try {
      const response = await api.put(`${BASE}/add`, complexData);
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
      const response = await api.patch(`${BASE}/${id}`, complexData);
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
      const response = await api.delete(`${BASE}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  search: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (key === 'mtk_ids' && Array.isArray(params[key]) && params[key].length > 0) {
          params[key].forEach((id) => {
            if (id !== null && id !== undefined && id !== '') {
              searchParams.append(`${key}[]`, String(id));
            }
          });
        } 
        else if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          searchParams.append(key, String(params[key]));
        }
      });
      const response = await api.get(`${SEARCH_BASE}?${searchParams.toString()}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateConfig: async (id, configData) => {
    try {
      const response = await api.patch(`${BASE}/config/${id}`, configData);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default complexesAPI;

