import api from "@/services/api";

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

export default permissionsAPI;

