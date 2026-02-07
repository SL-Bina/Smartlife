import api from "@/services/api";

const normalizeDate = (v) => {
  if (!v) return null;
  if (typeof v !== "string") return null;
  return v.split("T")[0].split(" ")[0] || null;
};

export const profileAPI = {
  getMe: async () => {
    try {
      const res = await api.get("/user/me");
      return res.data;
    } catch (err) {
      console.error("GET /user/me failed", err);
      throw err.response?.data || err;
    }
  },

  updateMe: async (form, current) => {
    try {
      const payload = {
        name: form.name?.trim() || current?.name || "",
        username: form.username?.trim() || current?.username || "",
        email: form.email?.trim() || current?.email || "",
        phone: form.phone?.trim() || current?.phone || "",
        birthday: normalizeDate(form.birthday) || normalizeDate(current?.birthday) || null,
        personal_code: form.personal_code?.trim() || current?.personal_code || null,
        is_user: Number(form.is_user ?? current?.is_user ?? 1),
        role_id: Number(form.role_id ?? current?.role_id ?? current?.role?.id ?? 1),
        modules: form.modules ?? current?.modules ?? ["*"],
        grant_permissions: form.grant_permissions ?? current?.grant_permissions ?? ["*"],
      };

      if (form.password?.trim()) {
        payload.password = form.password.trim();
        payload.password_confirmation = form.password_confirmation?.trim() || "";
      }

      console.log("PATCH /user/me → payload:", payload);

      const res = await api.patch("/user/me", payload);
      return res.data;
    } catch (err) {
      if (err.response?.status === 422 || err.response?.status === 400) {
        const data = err.response.data;
        const allErrors = [];

        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            (Array.isArray(messages) ? messages : [messages]).forEach(msg => {
              allErrors.push(`${field}: ${msg}`);
            });
          });
        }

        throw {
          message: data.message || "Validasiya xətası",
          allErrors,
          errors: data.errors,
          ...data
        };
      }

      throw err.response?.data || err.message || "Server xətası";
    }
  },
};

export default profileAPI;