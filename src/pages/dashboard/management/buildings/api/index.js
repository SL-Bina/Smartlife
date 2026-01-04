import api from "@/services/api";

// Buildings API
export const buildingsAPI = {
  // Tüm binaları getir (pagination ilə)
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/buildings/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tek bina getir
  getById: async (id) => {
    try {
      const response = await api.get(`/buildings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Yeni bina oluştur
  create: async (data) => {
    try {
      const cleanedData = {
        complex_id: data.complex_id || data.complex?.id || null,
        name: data.name || "",
        status: data.status || "active",
        meta: {
          desc: data.meta?.desc || "",
        },
      };

      console.log("Building Create Request:", cleanedData);
      console.log("Building Create Request (JSON):", JSON.stringify(cleanedData, null, 2));
      const response = await api.put("/buildings/add", cleanedData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        console.error("Building Create Error Response:", errorData);
        console.error("Building Create Error Details:", JSON.stringify(errorData, null, 2));
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
      console.error("Building Create Error:", error);
      throw error.response?.data || error.message;
    }
  },

  // Bina güncelle
  update: async (id, data) => {
    try {
      const cleanedData = {
        complex_id: data.complex_id || data.complex?.id || null,
        name: data.name || "",
        status: data.status || "active",
        meta: {
          desc: data.meta?.desc || "",
        },
      };

      console.log("Building Update Request:", cleanedData);
      const response = await api.patch(`/buildings/${id}`, cleanedData);
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

  // Bina sil
  delete: async (id) => {
    try {
      const response = await api.delete(`/buildings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default buildingsAPI;

