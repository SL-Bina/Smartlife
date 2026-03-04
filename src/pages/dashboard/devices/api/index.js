import api from "@/services/api";

// TODO: Replace these endpoints with real API paths when backend is ready
const BASE = "/module/devices";

export const devicesAPI = {
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

  create: async (data) => {
    try {
      const response = await api.put(`${BASE}/add`, data);
      return response;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const errors = Object.values(errorData.errors).flat().join(", ");
        throw new Error(errors || errorData.message || "Validation error");
      }
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.patch(`${BASE}/${id}`, data);
      return response;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const errors = Object.values(errorData.errors).flat().join(", ");
        throw new Error(errors || errorData.message || "Validation error");
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

  // Access Rules
  getAccessRules: async (params = {}) => {
    try {
      const response = await api.get(`${BASE}/access-rules`, { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Device Users
  getDeviceUsers: async (deviceId, params = {}) => {
    try {
      const response = await api.get(`${BASE}/${deviceId}/users`, { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Device Identifiers
  getDeviceIdentifiers: async (deviceId, params = {}) => {
    try {
      const response = await api.get(`${BASE}/${deviceId}/identifiers`, { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Device Logs
  getDeviceLogs: async (deviceId, params = {}) => {
    try {
      const response = await api.get(`${BASE}/${deviceId}/logs`, { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default devicesAPI;
