import api from "@/services/api";

// MTK API
export const mtkAPI = {
  // Tüm MTK-ları getir
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/mtk/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tek MTK getir
  getById: async (id) => {
    try {
      const response = await api.get(`/mtk/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Yeni MTK oluştur
  create: async (data) => {
    try {
      // Lat/Lng validation - yalnız düzgün dəyərləri göndər
      const lat = data.meta?.lat ? parseFloat(data.meta.lat) : null;
      const lng = data.meta?.lng ? parseFloat(data.meta.lng) : null;
      
      // Lat -90 ilə 90 arasında, Lng -180 ilə 180 arasında olmalıdır
      const isValidLat = lat !== null && !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLng = lng !== null && !isNaN(lng) && lng >= -180 && lng <= 180;

      // Məlumatları backend-in gözlədiyi formatda hazırla
      // Backend bütün field-ləri gözləyir, hətta boş olsalar belə
      const cleanedData = {
        name: data.name || "",
        status: data.status || "active",
        meta: {
          lat: isValidLat ? String(lat) : (data.meta?.lat || ""),
          lng: isValidLng ? String(lng) : (data.meta?.lng || ""),
          desc: data.meta?.desc || "",
          address: data.meta?.address || "",
          color_code: data.meta?.color_code || "",
          phone: data.meta?.phone || "",
          email: data.meta?.email || "",
          website: data.meta?.website || "",
        },
      };

      console.log("MTK Create Request:", cleanedData);
      const response = await api.put("/mtk/add", cleanedData);
      return response.data;
    } catch (error) {
      // 400 və 422 validation hatası için detaylı hata mesajı
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        console.error("MTK Create Error Response:", errorData);
        
        if (errorData.errors) {
          // Bütün xəta mesajlarını topla
          const allErrors = [];
          Object.keys(errorData.errors).forEach((key) => {
            const fieldErrors = errorData.errors[key];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((err) => allErrors.push(`${key}: ${err}`));
            } else {
              allErrors.push(`${key}: ${fieldErrors}`);
            }
          });
          
          const firstError = Object.values(errorData.errors)[0];
          throw {
            message: Array.isArray(firstError) ? firstError[0] : firstError,
            errors: errorData.errors,
            allErrors: allErrors,
            ...errorData
          };
        }
        throw errorData;
      }
      console.error("MTK Create Error:", error);
      throw error.response?.data || error.message;
    }
  },

  // MTK güncelle
  update: async (id, data) => {
    try {
      // Lat/Lng validation - yalnız düzgün dəyərləri göndər
      const lat = data.meta?.lat ? parseFloat(data.meta.lat) : null;
      const lng = data.meta?.lng ? parseFloat(data.meta.lng) : null;
      
      // Lat -90 ilə 90 arasında, Lng -180 ilə 180 arasında olmalıdır
      const isValidLat = lat !== null && !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLng = lng !== null && !isNaN(lng) && lng >= -180 && lng <= 180;

      // Məlumatları backend-in gözlədiyi formatda hazırla
      // Backend bütün field-ləri gözləyir, hətta boş olsalar belə
      const cleanedData = {
        name: data.name || "",
        status: data.status || "active",
        meta: {
          lat: isValidLat ? String(lat) : (data.meta?.lat || ""),
          lng: isValidLng ? String(lng) : (data.meta?.lng || ""),
          desc: data.meta?.desc || "",
          address: data.meta?.address || "",
          color_code: data.meta?.color_code || "",
          phone: data.meta?.phone || "",
          email: data.meta?.email || "",
          website: data.meta?.website || "",
        },
      };

      console.log("MTK Update Request:", cleanedData);
      const response = await api.put(`/mtk/${id}`, cleanedData);
      return response.data;
    } catch (error) {
      // 400 və 422 validation hatası için detaylı hata mesajı
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

  // MTK sil
  delete: async (id) => {
    try {
      const response = await api.delete(`/mtk/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default mtkAPI;

