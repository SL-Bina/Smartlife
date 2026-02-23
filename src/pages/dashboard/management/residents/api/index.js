import api from "@/services/api";

const residentsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/resident/list", { params });
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
        // Array parameters: mtk_ids[], complex_ids[]
        if ((key === 'mtk_ids' || key === 'complex_ids') && Array.isArray(params[key]) && params[key].length > 0) {
          params[key].forEach((id) => {
            if (id !== null && id !== undefined && id !== '') {
              searchParams.append(`${key}[]`, String(id));
            }
          });
        } 
        // Single value parameters: name, surname, email, phone, status
        else if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          searchParams.append(key, String(params[key]));
        }
      });
      const response = await api.get(`/search/module/resident?${searchParams.toString()}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/resident/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMe: async () => {
    try {
      const response = await api.get("/module/resident/config/me");
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  add: async (residentData) => {
    try {
      const response = await api.put("/module/resident/add", residentData);
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

  update: async (id, residentData) => {
    try {
      const response = await api.patch(`/module/resident/${id}`, residentData);
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
      const response = await api.delete(`/module/resident/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  bindProperty: async (residentId, propertyData) => {
    try {
      const response = await api.post(`/module/resident/bind-property/${residentId}`, propertyData);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  unbindProperty: async (residentId, propertyData) => {
    try {
      const response = await api.post(`/module/resident/unbind-property/${residentId}`, propertyData);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default residentsAPI;

