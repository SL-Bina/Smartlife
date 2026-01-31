import api from "@/services/api";

export const rolesAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/roles/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try { 
      const requestData = {
        role_name: data.name || data.role_name,
      };
      const response = await api.put("/module/roles/add", requestData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        let allErrors = [];
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((key) => {
            const fieldErrors = errorData.errors[key];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((err) => allErrors.push(`${key}: ${err}`));
            } else {
              allErrors.push(`${key}: ${fieldErrors}`);
            }
          });
        }
        throw {
          message: errorData.message || "Validation Error",
          errors: errorData.errors,
          allErrors: allErrors,
          ...errorData
        };
      }
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const requestData = {
        role_name: data.name || data.role_name,
      };
      const response = await api.patch(`/module/roles/${id}`, requestData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0];
          throw {
            message: Array.isArray(firstError) ? firstError[0] : firstError,
            errors: errorData.errors,
            ...errorData
          };
        }
        throw errorData;
      }
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/module/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  bindPermissions: async (roleId, permissionIds) => {
    try {
      const requestData = {
        role_id: roleId,
        permissions: Array.isArray(permissionIds) ? permissionIds.filter(id => id != null && id !== undefined && id !== '') : []
      };
      
      const response = await api.patch("/module/roles/assign-permissions", requestData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        let allErrors = [];
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((key) => {
            const fieldErrors = errorData.errors[key];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((err) => allErrors.push(`${key}: ${err}`));
            } else {
              allErrors.push(`${key}: ${fieldErrors}`);
            }
          });
        }
        throw {
          message: errorData.message || "Validation Error",
          errors: errorData.errors,
          allErrors: allErrors,
          ...errorData
        };
      }
      throw error.response?.data || error.message;
    }
  },
};

export const permissionsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/permissions/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/permissions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const response = await api.put("/module/permissions/add", data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        let allErrors = [];
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((key) => {
            const fieldErrors = errorData.errors[key];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((err) => allErrors.push(`${key}: ${err}`));
            } else {
              allErrors.push(`${key}: ${fieldErrors}`);
            }
          });
        }
        throw {
          message: errorData.message || "Validation Error",
          errors: errorData.errors,
          allErrors: allErrors,
          ...errorData
        };
      }
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.patch(`/module/permissions/${id}`, data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0];
          throw {
            message: Array.isArray(firstError) ? firstError[0] : firstError,
            errors: errorData.errors,
            ...errorData
          };
        }
        throw errorData;
      }
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/module/permissions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default { rolesAPI, permissionsAPI };

