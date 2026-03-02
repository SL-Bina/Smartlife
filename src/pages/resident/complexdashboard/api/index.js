import api from "@/services/api";

const residentComplexDashboardAPI = {
  getMyProperties: async () => {
    try {
      const response = await api.get("/module/resident/config/my/properties");
      const list = response?.data?.data || [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },

  // ── Feed posts ────────────────────────────────────────────────────────────
  getPosts: async (params = {}) => {
    try {
      const response = await api.get("/module/resident/config/complex/feed", { params });
      return response?.data?.data?.data ?? response?.data?.data ?? response?.data ?? [];
    } catch {
      return [];
    }
  },

  likePost: async (postId) => {
    try {
      const response = await api.post(`/module/resident/config/complex/feed/${postId}/like`);
      return response?.data;
    } catch {
      return null;
    }
  },

  // ── Comments ──────────────────────────────────────────────────────────────
  getComments: async (postId) => {
    try {
      const response = await api.get(`/module/resident/config/complex/feed/${postId}/comments`);
      return response?.data?.data?.data ?? response?.data?.data ?? response?.data ?? [];
    } catch {
      return [];
    }
  },

  addComment: async (postId, text) => {
    const response = await api.post(`/module/resident/config/complex/feed/${postId}/comments`, { body: text });
    return response?.data;
  },
};

export default residentComplexDashboardAPI;
