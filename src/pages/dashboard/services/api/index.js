import api from "@/services/api";

// Services API
export const servicesAPI = {
  // Tüm servisləri getir
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/services/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tek servis getir
  getById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Yeni servis oluştur
  create: async (data) => {
    try {
      const cleanedData = {
        name: data.name || "",
        description: data.description || "",
        price: data.price ? parseFloat(data.price) : 0,
      };

      console.log("Service Create Request:", cleanedData);
      const response = await api.put("/services/add", cleanedData);
      return response.data;
    } catch (error) {
      console.error("Service Create Error Response:", error.response?.data || error.message);
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const allErrors = Object.values(errorData.errors).flat();
          throw {
            message: allErrors.join(", "),
            errors: errorData.errors,
            allErrors: allErrors,
            ...errorData
          };
        }
        throw errorData;
      }
      throw error.response?.data || error.message;
    }
  },

  // Servis güncelle
  update: async (id, data) => {
    try {
      const cleanedData = {
        name: data.name || "",
        description: data.description || "",
        price: data.price ? parseFloat(data.price) : 0,
      };

      console.log("Service Update Request:", cleanedData);
      const response = await api.patch(`/services/${id}`, cleanedData);
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

  // Servis sil
  delete: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default servicesAPI;

