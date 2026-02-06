import api from "@/services/api";

// date normalize: "1995-08-21T00:00:00" -> "1995-08-21"
const normalizeDate = (v) => {
  if (!v) return null;
  if (typeof v !== "string") return null;
  return v.includes("T") ? v.split("T")[0] : v;
};

export const profileAPI = {
  getMe: async () => {
    try {
      const res = await api.get("/user/me");
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateMe: async (data, currentUser) => {
    try {
      // required payload (mütləq)
      const payload = {
        name: data.name ?? currentUser?.name ?? "",
        username: data.username ?? currentUser?.username ?? "",
        email: data.email ?? currentUser?.email ?? "",
        phone: data.phone ?? currentUser?.phone ?? "",
        is_user: Number(data.is_user ?? currentUser?.is_user ?? 1),
        role_id: Number(
          data.role_id ?? currentUser?.role_id ?? currentUser?.role?.id ?? 1
        ),
        modules: data.modules ?? ["*"],
        grant_permissions: data.grant_permissions ?? ["*"],
        birthday: normalizeDate(
          data.birthday ?? currentUser?.birthday ?? null
        ), // nullable
      };

      // sometimes
      if (data.personal_code ?? currentUser?.personal_code) {
        payload.personal_code = data.personal_code ?? currentUser.personal_code;
      }

      // password "sometimes" – yalnız user daxil edəndə göndər
      if (data.password) {
        payload.password = String(data.password);
        payload.password_confirmation = String(data.password_confirmation || "");
      }

      const res = await api.patch("/user/me", payload);
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

export default profileAPI;
