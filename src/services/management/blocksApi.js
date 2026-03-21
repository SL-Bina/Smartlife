import api from "@/services/api";

const BASE = "/module/blocks";
const SEARCH_BASE = "/search/module/block";

export const blocksAPI = {
  getLookupList: async (params = {}) => {
    try {
      const response = await api.get(`${BASE}/list`, { params });
      return response?.data?.data?.data || [];
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

  add: async (blockData) => {
    try {
      const response = await api.put(`${BASE}/add`, blockData);
      return response;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        let errorMessage = "";
        try {
          const errors = Object.values(errorData.errors).flat().join(", ");
          errorMessage = errors || errorData.message || "Validation error";
        } catch {
          errorMessage = errorData.message || "Validation error";
        }
        throw new Error(errorMessage);
      }
      throw error.response?.data || error.message;
    }
  },

  update: async (id, blockData) => {
    try {
      const response = await api.patch(`${BASE}/${id}`, blockData);
      return response;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        let errorMessage = "";
        try {
          const errors = Object.values(errorData.errors).flat().join(", ");
          errorMessage = errors || errorData.message || "Validation error";
        } catch {
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
      const formattedParams = { ...params };
      const searchParams = new URLSearchParams();

      Object.keys(formattedParams).forEach((key) => {
        if ((key === "mtk_ids" || key === "complex_ids" || key === "building_ids") && Array.isArray(formattedParams[key]) && formattedParams[key].length > 0) {
          formattedParams[key].forEach((id) => {
            if (id !== null && id !== undefined && id !== "") {
              searchParams.append(`${key}[]`, String(id));
            }
          });
        } else if (formattedParams[key] !== null && formattedParams[key] !== undefined && formattedParams[key] !== "") {
          searchParams.append(key, String(formattedParams[key]));
        }
      });

      const response = await api.get(`${SEARCH_BASE}?${searchParams.toString()}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default blocksAPI;
