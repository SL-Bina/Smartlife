import api from "@/services/api";

export const propertiesAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/properties/list", { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/properties/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  add: async (propertyData) => {
    try {
      const response = await api.put("/module/properties/add", propertyData);
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

  update: async (id, propertyData) => {
    try {
      const response = await api.patch(`/module/properties/${id}`, propertyData);
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
      const response = await api.delete(`/module/properties/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  search: async (params = {}) => {
    try {
      // Format array params with brackets notation
      const formattedParams = { ...params };
      
      // Build URLSearchParams manually to ensure array format
      const searchParams = new URLSearchParams();
      Object.keys(formattedParams).forEach((key) => {
        // Array parameters: mtk_ids[], complex_ids[], building_ids[], block_ids[]
        if ((key === 'mtk_ids' || key === 'complex_ids' || key === 'building_ids' || key === 'block_ids') && Array.isArray(formattedParams[key])) {
          formattedParams[key].forEach((id) => {
            if (id !== null && id !== undefined && id !== '') {
              searchParams.append(`${key}[]`, String(id));
            }
          });
        } 
        // Single value parameters: name, property_type, area, floor, apartment_number, status
        else if (formattedParams[key] !== null && formattedParams[key] !== undefined && formattedParams[key] !== '') {
          searchParams.append(key, String(formattedParams[key]));
        }
      });
      
      const response = await api.get(`/search/module/property?${searchParams.toString()}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getTypes: async (params = {}) => {
    try {
      const response = await api.get("/module/properties/type/list", { params });
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
      const response = await api.get(`/module/json/property/search-data?${searchParams.toString()}`);
      return response?.data?.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default propertiesAPI;

