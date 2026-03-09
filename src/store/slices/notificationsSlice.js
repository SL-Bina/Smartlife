import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],       // { id, title, message, type, data, receivedAt, read }
    unreadCount: 0,
  },
  reducers: {
    addNotification(state, action) {
      state.items.unshift({
        id: Date.now(),
        read: false,
        ...action.payload,
      });
      state.unreadCount += 1;
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
    },
  },
});

export const { addNotification, markAllRead, markRead, clearNotifications } =
  notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) => state.notifications.unreadCount;

export default notificationsSlice.reducer;
