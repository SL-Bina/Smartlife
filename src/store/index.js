import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import mtkReducer from './slices/management/mtkSlice';
import complexReducer from './slices/management/complexSlice';
import buildingReducer from './slices/management/buildingSlice';
import blockReducer from './slices/management/blockSlice';
import propertyReducer from './slices/management/propertySlice';
import residentReducer from './slices/management/residentSlice';
import notificationsReducer from './slices/notificationsSlice';
import dashboardHomeReducer from './slices/dashboardHomeSlice';
import financeInvoicesReducer from './slices/financeInvoicesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    mtk: mtkReducer,
    complex: complexReducer,
    building: buildingReducer,
    block: blockReducer,
    property: propertyReducer,
    resident: residentReducer,
    notifications: notificationsReducer,
    dashboardHome: dashboardHomeReducer,
    financeInvoices: financeInvoicesReducer,
  },
});

// Types for TypeScript (if needed)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

