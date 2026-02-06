import api from "@/services/api";

export const complexAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/complexes/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  getById: async (id) => {
    try {
      const response = await api.get(`/module/complexes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const cleanedData = {
        name: data?.name || "",
        mtk_id: data?.mtk_id ?? null,
        meta: {
          lat: data?.meta?.lat || "",
          lng: data?.meta?.lng || "",
          desc: data?.meta?.desc || "",
          address: data?.meta?.address || "",
          color_code: data?.meta?.color_code || "",
          phone: data?.meta?.phone || "",
          email: data?.meta?.email || "",
          website: data?.meta?.website || "",
        },
        modules: Array.isArray(data?.modules) ? data.modules : [],
        avaliable_modules: Array.isArray(data?.avaliable_modules) ? data.avaliable_modules : [],
        status: data?.status || "active",
      };

      const response = await api.put("/module/complexes/add", cleanedData);
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
        name: data?.name || "",
        mtk_id: data?.mtk_id ?? null,
        meta: {
          lat: data?.meta?.lat || "",
          lng: data?.meta?.lng || "",
          desc: data?.meta?.desc || "",
          address: data?.meta?.address || "",
          color_code: data?.meta?.color_code || "",
          phone: data?.meta?.phone || "",
          email: data?.meta?.email || "",
          website: data?.meta?.website || "",
        },
        modules: Array.isArray(data?.modules) ? data.modules : [],
        avaliable_modules: Array.isArray(data?.avaliable_modules) ? data.avaliable_modules : [],
        status: data?.status || "active",
      };

      const response = await api.patch(`/module/complexes/${id}`, cleanedData);
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
      const response = await api.delete(`/module/complexes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default complexAPI;
