import api from "@/services/api";

export const buildingAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/buildings/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/buildings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const cleanedData = {
        complex_id: data?.complex_id ?? null,
        name: data?.name || "",
        meta: {
          desc: data?.meta?.desc || "",
        },
        status: data?.status || "active",
      };

      const response = await api.put("/module/buildings/add", cleanedData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData?.errors) {
          const firstError = Object.values(errorData.errors)[0];
          throw {
            message: Array.isArray(firstError) ? firstError[0] : firstError,
            errors: errorData.errors,
            ...errorData,
          };
        }
        throw errorData;
      }
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const cleanedData = {
        complex_id: data?.complex_id ?? null,
        name: data?.name || "",
        meta: {
          desc: data?.meta?.desc || "",
        },
        status: data?.status || "active",
      };

      const response = await api.patch(`/module/buildings/${id}`, cleanedData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData?.errors) {
          const firstError = Object.values(errorData.errors)[0];
          throw {
            message: Array.isArray(firstError) ? firstError[0] : firstError,
            errors: errorData.errors,
            ...errorData,
          };
        }
        throw errorData;
      }
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/module/buildings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default buildingAPI;
