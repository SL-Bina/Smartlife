import axios from "axios";

const API_BASE_URL = "http://api.smartlife.az/api/v1";
const TOKEN_COOKIE_NAME = "smartlife_token";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't automatically logout on 401 - let the calling code handle it
    // This allows errors to be displayed to users instead of redirecting
    // Only remove token if it's explicitly an authentication error
    // and we're not on the sign-in page
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Only remove token if we're already on a protected route
      // Don't redirect - let the error be handled by the component
      if (currentPath !== "/auth/sign-in" && !currentPath.includes("/auth/")) {
        // Token might be invalid, but don't logout immediately
        // Let the error be displayed first
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (identifier, password) => {
    try {
      const response = await api.post("/auth/login", {
        login: identifier, 
        password,
      });
      return response.data;
    } catch (error) {
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

  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  me: async () => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.patch("/user/me", data);
      return response.data;
    } catch (error) {
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

  updatePassword: async (data) => {
    try {
      const response = await api.put("/user/password", data);
      return response.data;
    } catch (error) {
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

  getPermissions: async () => {
    try {
      const response = await api.get("/permissions/list");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};


export default api;

