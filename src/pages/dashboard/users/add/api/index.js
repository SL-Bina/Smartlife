import api from "@/services/api";

export const usersAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/user/list", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addUser: async (userData) => {
    try {
    const hasFile = userData.profile_photo && userData.profile_photo instanceof File;

    if (hasFile) {
      const formData = new FormData();

      formData.append("name", userData.name || "");
      formData.append("username", userData.username || "");
      formData.append("email", userData.email || "");
      formData.append("phone", userData.phone || "");
      formData.append("password", userData.password || "");
      formData.append("password_confirmation", userData.password_confirmation || "");
      formData.append("birthday", userData.birthday || "");
      formData.append("personal_code", userData.personal_code || "");
      formData.append("type", userData.type || 1);
      formData.append("is_user", userData.is_user || 1);
      formData.append("role_id", userData.role_id || "");

      if (userData.modules && Array.isArray(userData.modules)) {
        userData.modules.forEach((moduleId) => {
          formData.append("modules[]", moduleId);
        });
      }

      if (userData.mtk && Array.isArray(userData.mtk)) {
        userData.mtk.forEach((mtkId) => {
          formData.append("mtk[]", mtkId);
        });
      }

      if (userData.complex && Array.isArray(userData.complex)) {
        userData.complex.forEach((complexId) => {
          formData.append("complex[]", complexId);
        });
      }

      if (userData.apartments && Array.isArray(userData.apartments)) {
        userData.apartments.forEach((apartmentId) => {
          formData.append("apartments[]", apartmentId);
        });
      }

      if (userData.permissions && Array.isArray(userData.permissions)) {
        userData.permissions.forEach((permissionId) => {
          formData.append("permissions[]", permissionId);
        });
      }

      formData.append("profile_photo", userData.profile_photo);

      const response = await api.put("/user/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } else {
      const payload = {
        name: userData.name || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        password: userData.password || "",
        password_confirmation: userData.password_confirmation || "",
        birthday: userData.birthday || "",
        personal_code: userData.personal_code || "",
        type: userData.type || 1,
        is_user: userData.is_user || 1,
        role_id: userData.role_id || "",
        modules: userData.modules || [],
        mtk: userData.mtk || [],
        complex: userData.complex || [],
        apartments: userData.apartments || [],
        permissions: userData.permissions || [],
      };

      const response = await api.put("/user/add", payload);
      return response.data;
    }
  } catch (error) {
    if (error.response?.status === 422) {
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

  update: async (id, userData) => {
    try {
      const hasFile = userData.profile_photo && userData.profile_photo instanceof File;

      if (hasFile) {
        const formData = new FormData();
        formData.append("name", userData.name || "");
        formData.append("username", userData.username || "");
        formData.append("email", userData.email || "");
        formData.append("phone", userData.phone || "");
        if (userData.password) {
          formData.append("password", userData.password || "");
          formData.append("password_confirmation", userData.password_confirmation || "");
        }
        formData.append("birthday", userData.birthday || "");
        formData.append("personal_code", userData.personal_code || "");
        formData.append("type", userData.type || 1);
        formData.append("is_user", userData.is_user || 1);
        formData.append("role_id", userData.role_id || "");

        if (userData.modules && Array.isArray(userData.modules)) {
          userData.modules.forEach((moduleId) => {
            formData.append("modules[]", moduleId);
          });
        }
        if (userData.mtk && Array.isArray(userData.mtk)) {
          userData.mtk.forEach((mtkId) => {
            formData.append("mtk[]", mtkId);
          });
        }
        if (userData.complex && Array.isArray(userData.complex)) {
          userData.complex.forEach((complexId) => {
            formData.append("complex[]", complexId);
          });
        }
        if (userData.apartments && Array.isArray(userData.apartments)) {
          userData.apartments.forEach((apartmentId) => {
            formData.append("apartments[]", apartmentId);
          });
        }
        if (userData.permissions && Array.isArray(userData.permissions)) {
          userData.permissions.forEach((permissionId) => {
            formData.append("permissions[]", permissionId);
          });
        }

        formData.append("profile_photo", userData.profile_photo);

        const response = await api.patch(`/user/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } else {
        const payload = {
          name: userData.name || "",
          username: userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
          birthday: userData.birthday || "",
          personal_code: userData.personal_code || "",
          type: userData.type || 1,
          is_user: userData.is_user || 1,
          role_id: userData.role_id || "",
          modules: userData.modules || [],
          mtk: userData.mtk || [],
          complex: userData.complex || [],
          apartments: userData.apartments || [],
          permissions: userData.permissions || [],
        };
        if (userData.password) {
          payload.password = userData.password;
          payload.password_confirmation = userData.password_confirmation;
        }

        const response = await api.patch(`/user/${id}`, payload);
        return response.data;
      }
    } catch (error) {
      if (error.response?.status === 422) {
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
      const response = await api.delete(`/user/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export const addUser = usersAPI.addUser;

export default usersAPI;

