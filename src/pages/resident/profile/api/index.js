import api from "@/services/api";

// date normalize: "1995-08-21T00:00:00" -> "1995-08-21"
const normalizeDate = (v) => {
  if (!v) return null;
  if (typeof v !== "string") return null;
  return v.includes("T") ? v.split("T")[0] : v;
};

export const residentProfileAPI = {
  getMe: async () => {
    try {
      const res = await api.get("/module/resident/config/me");
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateMe: async (data) => {
    try {
      const payload = {
        name: data.name || "",
        surname: data.surname || "",
        email: data.email || "",
        phone: data.phone || "",
        meta: {
          gender: data.gender || null,
          birth_date: normalizeDate(data.birth_date || data.birthday || null),
          personal_code: data.personal_code || null,
        },
      };

      const res = await api.patch("/module/resident/config/me", payload);
      return res.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;

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
          allErrors,
          ...errorData,
        };
      }

      throw error.response?.data || error.message;
    }
  },

  updatePassword: async (data) => {
    try {
      const payload = {
        current_password: data.currentPassword,
        password: data.newPassword,
        password_confirmation: data.confirmPassword,
      };

      const res = await api.put("/module/resident/config/me/password", payload);
      return res.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const errorData = error.response.data;

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
          allErrors,
          ...errorData,
        };
      }

      throw error.response?.data || error.message;
    }
  },
};

export default residentProfileAPI;

