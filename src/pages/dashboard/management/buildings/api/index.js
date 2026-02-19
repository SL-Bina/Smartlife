import api from "@/services/api";

export const buildingsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/buildings/list", { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/buildings/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  add: async (buildingData) => {
    try {
      const response = await api.put("/module/buildings/add", buildingData);
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

  update: async (id, buildingData) => {
    try {
      const response = await api.patch(`/module/buildings/${id}`, buildingData);
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
      const response = await api.delete(`/module/buildings/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  search: async (params = {}) => {
    try {
      // Format complex_ids as array with brackets notation
      const formattedParams = { ...params };
      
      // Build URLSearchParams manually to ensure complex_ids[] format
      const searchParams = new URLSearchParams();
      Object.keys(formattedParams).forEach((key) => {
        // Array parameter: complex_ids[]
        if (key === 'complex_ids' && Array.isArray(formattedParams[key]) && formattedParams[key].length > 0) {
          formattedParams[key].forEach((id) => {
            if (id !== null && id !== undefined && id !== '') {
              searchParams.append(`${key}[]`, String(id));
            }
          });
        } 
        // Single value parameters: name, status
        else if (formattedParams[key] !== null && formattedParams[key] !== undefined && formattedParams[key] !== '') {
          searchParams.append(key, String(formattedParams[key]));
        }
      });
      
      const response = await api.get(`/search/module/building?${searchParams.toString()}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default buildingsAPI;

