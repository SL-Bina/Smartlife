import api from "@/services/api";

export const propertyServiceFeeAPI = {
  getList: async (propertyId, params = {}) => {
    try {
      const response = await api.get(`/module/service-configure/property/list/${propertyId}`, { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (propertyId, id) => {
    try {
      const response = await api.get(`/module/service-configure/property/${propertyId}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  add: async (propertyId, serviceFeeData) => {
    try {
      const response = await api.put(`/module/service-configure/property/${propertyId}/add`, serviceFeeData);
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

  update: async (propertyId, id, serviceFeeData) => {
    try {
      const response = await api.patch(`/module/service-configure/property/${propertyId}/${id}`, serviceFeeData);
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

  delete: async (propertyId, id) => {
    try {
      const response = await api.delete(`/module/service-configure/property/${propertyId}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default propertyServiceFeeAPI;

