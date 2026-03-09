import { createSlice } from "@reduxjs/toolkit";

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

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],       // { id, title, message, type, data, receivedAt, read }
    unreadCount: 0,
    page: 1,
    lastPage: 1,
  },
  reducers: {
    /** Add a single real-time notification (from WebSocket) */
    addNotification(state, action) {
      // Avoid duplicates if server also sends it via REST
      if (state.items.some((n) => n.id === action.payload.id)) return;
      state.items.unshift({
        id: action.payload.id ?? Date.now(),
        read: false,
        ...action.payload,
      });
      state.unreadCount += 1;
    },
    /** Merge a page of notifications fetched from the REST API */
    mergeApiNotifications(state, action) {
      const { items, page, lastPage } = action.payload;
      const existingIds = new Set(state.items.map((n) => n.id));
      for (const item of items) {
        if (!existingIds.has(item.id)) {
          state.items.push(item);
        }
      }
      // Re-sort by date descending
      state.items.sort(
        (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      );
      state.unreadCount = state.items.filter((n) => !n.read).length;
      state.page = page;
      state.lastPage = lastPage;
    },
    markAllRead(state) {
      state.items = state.items.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    markRead(state, action) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
      state.page = 1;
      state.lastPage = 1;
    },
  },
});

export const {
  addNotification,
  mergeApiNotifications,
  markAllRead,
  markRead,
  clearNotifications,
} = notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsPage = (state) => state.notifications.page;
export const selectNotificationsLastPage = (state) => state.notifications.lastPage;

export default notificationsSlice.reducer;
