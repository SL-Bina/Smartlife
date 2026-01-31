import axios from "axios";

const API_BASE_URL = "http://api.smartlife.az/api/v1";
const TOKEN_COOKIE_NAME = "smartlife_token";

// Cookie helper fonksiyonları
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // withCredentials: false - CORS sorunu için kapatıldı, token-based auth kullanıyoruz
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
  (config) => {
    const token = getCookie(TOKEN_COOKIE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized - token geçersiz veya süresi dolmuş
    if (error.response?.status === 401) {
      removeCookie(TOKEN_COOKIE_NAME);
      // Login sayfasına yönlendir
      if (window.location.pathname !== "/auth/sign-in") {
        window.location.href = "/auth/sign-in";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Login - API email, username, phone və ya name qəbul edir
  login: async (identifier, password) => {
    try {
      const response = await api.post("/auth/login", {
        email: identifier, // Backend hələ də email field-ı gözləyir, amma identifier dəyərini göndəririk
        password,
      });
      return response.data;
    } catch (error) {
      // 422 validation hatası için detaylı hata mesajı
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        // Laravel validation error formatı
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

  // Logout
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Me - kullanıcı bilgilerini getir
  me: async () => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update profile - kullanıcı bilgilerini güncelle
  updateProfile: async (data) => {
    try {
      const response = await api.patch("/user/me", data);
      return response.data;
    } catch (error) {
      // 422 validation hatası için detaylı hata mesajı
      if (error.response?.status === 422) {
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

  // Update password - şifre güncelle
  updatePassword: async (data) => {
    try {
      const response = await api.put("/user/password", data);
      return response.data;
    } catch (error) {
      // 422 validation hatası için detaylı hata mesajı
      if (error.response?.status === 422) {
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

  // Permissions list - kullanıcının yetkili olduğu modülleri getir
  getPermissions: async () => {
    try {
      const response = await api.get("/permissions/list");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Buildings API (örnek)
export const buildingsAPI = {
  // Tüm binaları getir
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/buildings", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tek binayı getir
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
      const response = await api.post("/buildings", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Binayı güncelle
  update: async (id, data) => {
    try {
      const response = await api.put(`/buildings/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Binayı sil
  delete: async (id) => {
    try {
      const response = await api.delete(`/buildings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;

