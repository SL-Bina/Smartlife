import api from "@/services/api";

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

  // Basip Project integration endpoints
  getBasipDevices: async (params = {}) => {
    try {
      const response = await api.get("/integration/device/basip-project/devices", { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBasipDevice: async (id, params = {}) => {
    try {
      const response = await api.get(`/integration/device/basip-project/devices/${id}`, { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBasipLogs: async (params = {}) => {
    try {
      const response = await api.get("/integration/device/basip-project/log-list", { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBasipUsers: async ({ complex_id, page = 1, size = 20 }) => {
    try {
      const response = await api.post("/integration/device/basip-project/users", {
        complex_id,
        page,
        size,
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBasipUser: async ({ id, complex_id }) => {
    try {
      const response = await api.post(`/integration/device/basip-project/users/${id}`, {
        complex_id,
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addBasipUser: async (data) => {
    try {
      const response = await api.patch("/integration/device/basip-project/users/add", data);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteBasipUser: async ({ user_id, complex_id }) => {
    try {
      const response = await api.delete(`/integration/device/basip-project/users/${user_id}`, {
        data: {
          complex_id,
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Basip Project access rules endpoints
  getBasipAccessRules: async ({ complex_id, page = 1, size = 20 }) => {
    try {
      const response = await api.post("/integration/device/basip-project/access-rules/list", {
        complex_id,
        page,
        size,
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBasipAccessRule: async (id) => {
    try {
      const response = await api.get(`/integration/device/basip-project/access-rules/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addEditBasipAccessRule: async (data) => {
    try {
      const response = await api.put("/integration/device/basip-project/access-rules/add-edit", data);
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

  // Basip Project identifier endpoints
  getBasipIdentifiers: async ({ complex_id, page = 1, size = 20 }) => {
    try {
      const response = await api.post("/integration/device/basip-project/identifiers", {
        complex_id,
        page,
        size,
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBasipIdentifier: async ({ id, complex_id }) => {
    try {
      const response = await api.post(`/integration/device/basip-project/identifiers/${id}`, {
        complex_id,
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addBasipIdentifier: async (data) => {
    try {
      const response = await api.put("/integration/device/basip-project/identifiers/add", data);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBasipIdentifier: async ({ id, ...data }) => {
    try {
      const response = await api.patch(`/integration/device/basip-project/identifiers/${id}`, data);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteBasipIdentifier: async ({ id, complex_id }) => {
    try {
      const response = await api.delete(`/integration/device/basip-project/identifiers/${id}`, {
        data: {
          complex_id,
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default devicesAPI;
