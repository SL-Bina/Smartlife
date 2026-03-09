import api from "@/services/api";

export const notificationsAPI = {
  /** GET /user/my/notifications?page=X  — current user's paginated notifications */
  getMyNotifications: (page = 1) =>
    api.get("/user/my/notifications", { params: { page } }),

  /** POST /module/notifications/:id/read */
  markRead: (id) =>
    api.post(`/module/notifications/${id}/read`),

  /** POST /module/notifications/read-all */
  markAllRead: () =>
    api.post("/module/notifications/read-all"),
};
