import api from "@/services/api";

const BASE = "/module/resident";
const SEARCH_BASE = "/search/module/resident";

export const residentsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get(`${BASE}/list`, { params });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  search: async (params = {}) => {
    try {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if ((key === "mtk_ids" || key === "complex_ids") && Array.isArray(params[key]) && params[key].length > 0) {
          params[key].forEach((id) => {
            if (id !== null && id !== undefined && id !== "") {
              searchParams.append(`${key}[]`, String(id));
            }
          });
        } else if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
          searchParams.append(key, String(params[key]));
        }
      });
      const response = await api.get(`${SEARCH_BASE}?${searchParams.toString()}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`${BASE}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMe: async () => {
    try {
      const response = await api.get(`${BASE}/config/me`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  add: async (residentData) => {
    try {
      const response = await api.put(`${BASE}/add`, residentData);
      return response;
    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data;

      if (status === 426) {
        const err = new Error(errorData?.message || "Sakin artıq mövcuddur");
        err.status = 426;
        throw err;
      }

      if (errorData?.errors) {
        let errorMessage = "";
        try {
          const errors = Object.values(errorData.errors).flat().join(", ");
          errorMessage = errors || errorData.message || "Validation error";
        } catch {
          errorMessage = errorData.message || "Validation error";
        }
        throw new Error(errorMessage);
      }
      throw error.response?.data || error.message;
    }
  },

  update: async (id, residentData) => {
    try {
      const response = await api.patch(`${BASE}/${id}`, residentData);
      return response;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        let errorMessage = "";
        try {
          const errors = Object.values(errorData.errors).flat().join(", ");
          errorMessage = errors || errorData.message || "Validation error";
        } catch {
          errorMessage = errorData.message || "Validation error";
        }
        throw new Error(errorMessage);
      }
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`${BASE}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  bindProperty: async (residentId, propertyData) => {
    try {
      const response = await api.post(`${BASE}/bind-property/${residentId}`, propertyData);
      if (response.data?.success === false) {
        throw response.data;
      }
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  unbindProperty: async (residentId, propertyData) => {
    try {
      const response = await api.post(`${BASE}/unbind-property/${residentId}`, propertyData);
      if (response.data?.success === false) {
        throw response.data;
      }
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default residentsAPI;
