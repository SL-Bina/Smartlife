import api from "@/services/api";

const isBase64Image = (v) =>
  typeof v === "string" && v.startsWith("data:image/");

const normalizeBase64Image = (v) => {
  // backend "data:image/png;base64,..." qəbul edirsə belə saxla
  // qəbul etmirsə aşağıdakı return-u dəyiş:
  // return isBase64Image(v) ? v.split(",")[1] : v;
  return v;
};

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
      const lat = data.meta?.lat ? parseFloat(data.meta.lat) : null;
      const lng = data.meta?.lng ? parseFloat(data.meta.lng) : null;

      const isValidLat = lat !== null && !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLng = lng !== null && !isNaN(lng) && lng >= -180 && lng <= 180;

      // logo
      const logo = data.logo ? normalizeBase64Image(data.logo) : null;

      // photos
      const rawPhotos = Array.isArray(data.photos) ? data.photos : [];
      const photos = rawPhotos
        .filter(Boolean)
        .slice(0, 10) // max 10
        .map((p) => normalizeBase64Image(p));

      const cleanedData = {
        name: data.name || "",
        status: data.status || "active",
        mtk_id: data.bind_mtk?.id || data.mtk_id || 1,
        modules: Array.isArray(data.modules) && data.modules.length > 0 ? data.modules : [1],
        avaliable_modules:
          Array.isArray(data.avaliable_modules) && data.avaliable_modules.length > 0
            ? data.avaliable_modules
            : [1],

        // ✅ payload-a əlavə et
        logo: logo,      // string | null
        photos: photos,  // string[]

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

      const response = await api.put("/module/complexes/add", cleanedData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        console.error("Complex Create Error Response:", errorData);
        console.error("Complex Create Error Details:", JSON.stringify(errorData, null, 2));

        if (errorData.errors) {
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
            allErrors,
            ...errorData,
          };
        }
        throw errorData;
      }
      console.error("Complex Create Error:", error);
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const lat = data.meta?.lat ? parseFloat(data.meta.lat) : null;
      const lng = data.meta?.lng ? parseFloat(data.meta.lng) : null;

      const isValidLat = lat !== null && !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLng = lng !== null && !isNaN(lng) && lng >= -180 && lng <= 180;

      const logo = data.logo ? normalizeBase64Image(data.logo) : null;

      const rawPhotos = Array.isArray(data.photos) ? data.photos : [];
      const photos = rawPhotos
        .filter(Boolean)
        .slice(0, 10)
        .map((p) => normalizeBase64Image(p));

      const cleanedData = {
        name: data.name || "",
        status: data.status || "active",
        mtk_id: data.bind_mtk?.id || data.mtk_id || 1,
        modules: Array.isArray(data.modules) && data.modules.length > 0 ? data.modules : [1],
        avaliable_modules:
          Array.isArray(data.avaliable_modules) && data.avaliable_modules.length > 0
            ? data.avaliable_modules
            : [1],

        // ✅ payload-a əlavə et
        logo: logo,
        photos: photos,

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
      console.log("Complex Update Request (JSON):", JSON.stringify(cleanedData, null, 2));

      const response = await api.patch(`/module/complexes/${id}`, cleanedData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;
        if (errorData.errors) {
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
