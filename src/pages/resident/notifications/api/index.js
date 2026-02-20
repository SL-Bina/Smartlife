import api from "@/services/api";

export const residentNotificationsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/module/resident/config/my/notifications", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/module/resident/config/my/notification/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default residentNotificationsAPI;

