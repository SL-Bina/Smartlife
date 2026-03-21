import { createSlice } from "@reduxjs/toolkit";

export function createRealtimeListSlice({
  name,
  initialState,
  itemIdKey = "id",
  itemDateKey = "receivedAt",
}) {
  return createSlice({
    name,
    initialState,
    reducers: {
      addItem(state, action) {
        if (state.items.some((item) => item[itemIdKey] === action.payload[itemIdKey])) return;
        state.items.unshift(action.payload);
        state.unreadCount += 1;
      },
      mergePageItems(state, action) {
        const { items, page, lastPage } = action.payload;
        const existingIds = new Set(state.items.map((item) => item[itemIdKey]));

        for (const item of items) {
          if (!existingIds.has(item[itemIdKey])) {
            state.items.push(item);
          }
        }

        state.items.sort(
          (a, b) => new Date(b[itemDateKey]).getTime() - new Date(a[itemDateKey]).getTime()
        );

        state.unreadCount = state.items.filter((item) => !item.read).length;
        state.page = page;
        state.lastPage = lastPage;
      },
      markAllItemsRead(state) {
        state.items = state.items.map((item) => ({ ...item, read: true }));
        state.unreadCount = 0;
      },
      markItemRead(state, action) {
        const item = state.items.find((entry) => entry[itemIdKey] === action.payload);
        if (item && !item.read) {
          item.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      },
      clearItems(state) {
        state.items = [];
        state.unreadCount = 0;
        state.page = 1;
        state.lastPage = 1;
      },
    },
  });
}
