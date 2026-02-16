import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import mtkReducer from './slices/mtkSlice';
import complexReducer from './slices/complexSlice';
import buildingReducer from './slices/buildingSlice';
import blockReducer from './slices/blockSlice';
import propertyReducer from './slices/propertySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    mtk: mtkReducer,
    complex: complexReducer,
    building: buildingReducer,
    block: blockReducer,
    property: propertyReducer,
  },
});

// Types for TypeScript (if needed)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

