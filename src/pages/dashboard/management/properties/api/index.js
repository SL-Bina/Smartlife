import api from "@/services/api";

export const propertiesAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/properties/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/module/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const cleanedData = {
        mtk_id: Number(data.mtk_id) || null,
        complex_id: Number(data.complex_id) || null,
        building_id: Number(data.building_id) || null,
        block_id: Number(data.block_id) || null,
        name: data.name || "",
        meta: {
          apartment_number: data.meta?.apartment_number ? Number(data.meta.apartment_number) : null,
          floor: data.meta?.floor ? Number(data.meta.floor) : null,
          area: data.meta?.area ? Number(data.meta.area) : null,
        },
        property_type: Number(data.property_type) || 1,
        status: data.status || "active",
      };

      // backend required-ləri yoxla
      console.log("Properties Create Request:", cleanedData);
      const response = await api.put("/module/properties/add", cleanedData);
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
        mtk_id: Number(data.mtk_id) || null,
        complex_id: Number(data.complex_id) || null,
        building_id: Number(data.building_id) || null,
        block_id: Number(data.block_id) || null,
        name: data.name || "",
        meta: {
          apartment_number: data.meta?.apartment_number ? Number(data.meta.apartment_number) : null,
          floor: data.meta?.floor ? Number(data.meta.floor) : null,
          area: data.meta?.area ? Number(data.meta.area) : null,
        },
        property_type: Number(data.property_type) || 1,
        status: data.status || "active",
      };

      console.log("Properties Update Request:", cleanedData);
      const response = await api.patch(`/module/properties/${id}`, cleanedData);
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
      const response = await api.delete(`/module/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default propertiesAPI;
