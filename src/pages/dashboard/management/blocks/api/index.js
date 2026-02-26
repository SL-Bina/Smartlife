import api from "@/services/api";

export const blocksAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/blocks/list", { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/blocks/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  add: async (blockData) => {
    try {
      const response = await api.put("/module/blocks/add", blockData);
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

  update: async (id, blockData) => {
    try {
      const response = await api.patch(`/module/blocks/${id}`, blockData);
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
      const response = await api.delete(`/module/blocks/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  search: async (params = {}) => {
    try {
      // Format complex_ids and building_ids as arrays with brackets notation
      const formattedParams = { ...params };
      
      // Build URLSearchParams manually to ensure array format
      const searchParams = new URLSearchParams();
      Object.keys(formattedParams).forEach((key) => {
        // Array parameters: complex_ids[], building_ids[]
        if ((key === 'mtk_ids' || key === 'complex_ids' || key === 'building_ids') && Array.isArray(formattedParams[key]) && formattedParams[key].length > 0) {
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
      
      const response = await api.get(`/search/module/block?${searchParams.toString()}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default blocksAPI;

