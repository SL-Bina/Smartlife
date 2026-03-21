import api from "@/services/api";

const BASE = "/module/properties";
const SEARCH_BASE = "/search/module/property";

export const propertiesAPI = {
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

  add: async (propertyData) => {
    try {
      const response = await api.put(`${BASE}/add`, propertyData);
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

  update: async (id, propertyData) => {
    try {
      const response = await api.patch(`${BASE}/${id}`, propertyData);
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
        if ((key === "mtk_ids" || key === "complex_ids" || key === "building_ids" || key === "block_ids") && Array.isArray(formattedParams[key])) {
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

  getTypes: async (params = {}) => {
    try {
      const response = await api.get(`${BASE}/type/list`, { params });
      return response?.data?.data?.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPropertyTypes: async (params = {}) => {
    try {
      const response = await api.get(`${BASE}/type/list`, { params });
      return response?.data?.data?.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSearchData: async (type, ids = []) => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("type", type);
      ids.forEach((id) => {
        searchParams.append("ids[]", String(id));
      });
      const response = await api.get(`${SEARCH_BASE}?${searchParams.toString()}`);
      return response?.data?.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default propertiesAPI;
