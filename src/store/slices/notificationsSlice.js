import { createRealtimeListSlice } from "./utils/createRealtimeListSlice";

/** Convert an item from the REST API response to our canonical shape */
export function normalizeApiNotification(n) {
  return {
    id: n.id,
    title: n.title || "",
    message: n.message || "",
    type: n.type || "info",
    data: n.data || null,
    receivedAt: n.created_at,
    read: n.read_at !== null && n.read_at !== undefined,
  };
}

const notificationsSlice = createRealtimeListSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    page: 1,
    lastPage: 1,
  },
});

const { addItem, mergePageItems, markAllItemsRead, markItemRead, clearItems } =
  notificationsSlice.actions;

export const addNotification = (payload) =>
  addItem({
    id: payload.id ?? Date.now(),
    read: false,
    ...payload,
  });

export const mergeApiNotifications = (payload) => mergePageItems(payload);
export const markAllRead = () => markAllItemsRead();
export const markRead = (id) => markItemRead(id);
export const clearNotifications = () => clearItems();

export const selectNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsPage = (state) => state.notifications.page;
export const selectNotificationsLastPage = (state) => state.notifications.lastPage;

export default notificationsSlice.reducer;
