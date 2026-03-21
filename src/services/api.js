import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
const API_BASE_URL = import.meta.env.DEV ? "/api" : (configuredBaseUrl || "/api");
const TOKEN_COOKIE_NAME = "smartlife_token";
const RESIDENT_SKIP_PATHS = ["/module/resident/config/me"];

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const serializeParams = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          searchParams.append(`${key}[]`, item);
        }
      });
      return;
    }

    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

const formatValidationError = (errorData) => {
  if (!errorData?.errors) return errorData;
  const firstError = Object.values(errorData.errors)[0];
  return {
    message: Array.isArray(firstError) ? firstError[0] : firstError,
    errors: errorData.errors,
    ...errorData,
  };
};

const normalizeApiError = (error, { preferValidationObject = false } = {}) => {
  if (preferValidationObject && error?.response?.status === 422) {
    const errorData = error.response?.data;
    return formatValidationError(errorData);
  }
  return error?.response?.data || error?.message;
};

const callApi = async (request, options = {}) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, options);
  }
};

const shouldAttachApartment = (url = "") => {
  if (!url.includes("/module/resident")) return false;
  return !RESIDENT_SKIP_PATHS.some((path) => url.endsWith(path));
};

const attachResidentApartment = async (config) => {
  if (!shouldAttachApartment(config.url)) return config;

  const { store } = await import("@/store");
  const apartmentId = store.getState()?.property?.selectedPropertyId;
  if (!apartmentId) return config;

  config.params = config.params || {};
  if (!config.params.apartmentId && !config.params.apartment_id) {
    config.params.apartmentId = apartmentId;
    config.params.property_id = apartmentId;
  }

  return config;
};


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  paramsSerializer: {
    serialize: serializeParams,
  },
});


api.interceptors.request.use(
  async (config) => {
    const token = getCookie(TOKEN_COOKIE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      await attachResidentApartment(config);
    } catch (ex) {
      console.warn("Failed to attach apartmentId to request", ex);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use((response) => response, (error) => Promise.reject(error));

export const authAPI = {
  login: (identifier, password) =>
    callApi(
      () =>
        api.post("/auth/login", {
        login: identifier, 
        password,
        }),
      { preferValidationObject: true }
    ),

  logout: () => callApi(() => api.post("/auth/logout")),

  me: () => callApi(() => api.get("/user/me")),

  residentMe: () => callApi(() => api.get("/module/resident/config/me")),

  updateProfile: (data) =>
    callApi(() => api.patch("/user/me", data), { preferValidationObject: true }),

  updatePassword: (data) =>
    callApi(() => api.put("/user/password", data), { preferValidationObject: true }),

  getPermissions: () => callApi(() => api.get("/permissions/list")),
};


export default api;

