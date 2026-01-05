import api from "@/services/api";

// Roles API
export const rolesAPI = {
  // Bütün rolları gətir
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/roles/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Konkret rol detalları
  getById: async (id) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Yeni rol əlavə et
  create: async (data) => {
    try { 
      // API role_name gözləyir
      const requestData = {
        role_name: data.name || data.role_name,
      };
      const response = await api.put("/roles/add", requestData);
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

  // Rol yenilə
  update: async (id, data) => {
    try {
      // API role_name gözləyir
      const requestData = {
        role_name: data.name || data.role_name,
      };
      const response = await api.patch(`/roles/${id}`, requestData);
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

  // Rol sil
  delete: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Rol üçün permission-ları təyin et
  bindPermissions: async (roleId, permissionIds) => {
    try {
      // Permission-ları array kimi göndər, boş olsa belə
      const requestData = {
        role_id: roleId,
        permissions: Array.isArray(permissionIds) ? permissionIds.filter(id => id != null && id !== undefined && id !== '') : []
      };
      
      const response = await api.patch("/roles/assign-permissions", requestData);
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

// Permissions API
export const permissionsAPI = {
  // Bütün modullar və permission-ları gətir
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/permissions/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Konkret permission detalları
  getById: async (id) => {
    try {
      const response = await api.get(`/permissions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Yeni permission əlavə et
  create: async (data) => {
    try {
      const response = await api.put("/permissions/add", data);
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

  // Permission yenilə
  update: async (id, data) => {
    try {
      const response = await api.patch(`/permissions/${id}`, data);
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

  // Permission sil
  delete: async (id) => {
    try {
      const response = await api.delete(`/permissions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default { rolesAPI, permissionsAPI };

