import api from "@/services/api";

// Complex API
export const complexAPI = {
  // Tüm kompleksləri getir (pagination ilə)
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/complexes/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tek kompleks getir
  getById: async (id) => {
    try {
      const response = await api.get(`/complexes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Yeni kompleks oluştur
  create: async (data) => {
    try {
      // Lat/Lng validation - yalnız düzgün dəyərləri göndər
      const lat = data.meta?.lat ? parseFloat(data.meta.lat) : null;
      const lng = data.meta?.lng ? parseFloat(data.meta.lng) : null;
      
      // Lat -90 ilə 90 arasında, Lng -180 ilə 180 arasında olmalıdır
      const isValidLat = lat !== null && !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLng = lng !== null && !isNaN(lng) && lng >= -180 && lng <= 180;

      // Məlumatları backend-in gözlədiyi formatda hazırla
      // Backend name, status, meta, mtk_id, modules, avaliable_modules gözləyir
      const cleanedData = {
        name: data.name || "",
        status: data.status || "active",
        mtk_id: data.bind_mtk?.id || data.mtk_id || 1, // Default 1 göndərək
        modules: Array.isArray(data.modules) && data.modules.length > 0 ? data.modules : [1], // Default [1] göndərək
        avaliable_modules: Array.isArray(data.avaliable_modules) && data.avaliable_modules.length > 0 ? data.avaliable_modules : [1], // Default [1] göndərək
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

      console.log("Complex Create Request:", cleanedData);
      console.log("Complex Create Request (JSON):", JSON.stringify(cleanedData, null, 2));
      const response = await api.put("/complexes/add", cleanedData);
      return response.data;
    } catch (error) {
      // 400 və 422 validation hatası için detaylı hata mesajı
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        console.error("Complex Create Error Response:", errorData);
        console.error("Complex Create Error Details:", JSON.stringify(errorData, null, 2));
        
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
      console.error("Complex Create Error:", error);
      throw error.response?.data || error.message;
    }
  },

  // Kompleks güncelle
  update: async (id, data) => {
    try {
      // Lat/Lng validation - yalnız düzgün dəyərləri göndər
      const lat = data.meta?.lat ? parseFloat(data.meta.lat) : null;
      const lng = data.meta?.lng ? parseFloat(data.meta.lng) : null;
      
      // Lat -90 ilə 90 arasında, Lng -180 ilə 180 arasında olmalıdır
      const isValidLat = lat !== null && !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLng = lng !== null && !isNaN(lng) && lng >= -180 && lng <= 180;

      // Məlumatları backend-in gözlədiyi formatda hazırla
      // Backend name, status, meta, mtk_id, modules, avaliable_modules gözləyir
      const cleanedData = {
        name: data.name || "",
        status: data.status || "active",
        mtk_id: data.bind_mtk?.id || data.mtk_id || 1, // Default 1 göndərək
        modules: Array.isArray(data.modules) && data.modules.length > 0 ? data.modules : [1], // Default [1] göndərək
        avaliable_modules: Array.isArray(data.avaliable_modules) && data.avaliable_modules.length > 0 ? data.avaliable_modules : [1], // Default [1] göndərək
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

      console.log("Complex Update Request:", cleanedData);
      const response = await api.patch(`/complexes/${id}`, cleanedData);
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

  // Kompleks sil
  delete: async (id) => {
    try {
      const response = await api.delete(`/complexes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default complexAPI;

