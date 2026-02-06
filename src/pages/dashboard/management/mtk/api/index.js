import api from "@/services/api";

export const mtkAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/mtk/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/mtk/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const lat = data.meta?.lat ? parseFloat(data.meta.lat) : null;
      const lng = data.meta?.lng ? parseFloat(data.meta.lng) : null;

      const isValidLat = lat !== null && !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLng = lng !== null && !isNaN(lng) && lng >= -180 && lng <= 180;

      const cleanedData = {
        name: data.name || "",
        status: data.status || "active",
        meta: {
          lat: isValidLat ? String(lat) : data.meta?.lat || "",
          lng: isValidLng ? String(lng) : data.meta?.lng || "",
          desc: data.meta?.desc || "",
          address: data.meta?.address || "",
          color_code: data.meta?.color_code || "",
          phone: data.meta?.phone || "",
          email: data.meta?.email || "",
          website: data.meta?.website || "",
        },
      };

      const response = await api.put("/module/mtk/add", cleanedData);
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
      const lat = data.meta?.lat ? parseFloat(data.meta.lat) : null;
      const lng = data.meta?.lng ? parseFloat(data.meta.lng) : null;

      const isValidLat = lat !== null && !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLng = lng !== null && !isNaN(lng) && lng >= -180 && lng <= 180;

      const cleanedData = {
        name: data.name || "",
        status: data.status || "active",
        meta: {
          lat: isValidLat ? String(lat) : data.meta?.lat || "",
          lng: isValidLng ? String(lng) : data.meta?.lng || "",
          desc: data.meta?.desc || "",
          address: data.meta?.address || "",
          color_code: data.meta?.color_code || "",
          phone: data.meta?.phone || "",
          email: data.meta?.email || "",
          website: data.meta?.website || "",
        },
      };

      const response = await api.patch(`/module/mtk/${id}`, cleanedData);
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
      const response = await api.delete(`/module/mtk/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default mtkAPI;
