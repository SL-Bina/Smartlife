import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import buildingsAPI from '@/pages/dashboard/management/buildings/api';

// Cookie utilities
const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  } catch (e) {
    console.error(`Error reading cookie ${name}:`, e);
    return null;
  }
};

const setCookie = (name, value, days = 365) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  } catch (e) {
    console.error(`Error writing cookie ${name}:`, e);
  }
};

const removeCookie = (name) => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  } catch (e) {
    console.error(`Error removing cookie ${name}:`, e);
  }
};

const COOKIE_KEYS = {
  BUILDING_ID: 'smartlife_building_id',
};

// Initial state
const initialState = {
  selectedBuildingId: getCookie(COOKIE_KEYS.BUILDING_ID) ? parseInt(getCookie(COOKIE_KEYS.BUILDING_ID), 10) : null,
  selectedBuilding: null,
  buildings: [],
  loading: false,
  error: null,
};

// Async thunks
export const loadBuildings = createAsyncThunk(
  'building/loadBuildings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await buildingsAPI.getAll(params);
      return response?.data?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load Buildings');
    }
  }
);

export const loadBuildingById = createAsyncThunk(
  'building/loadBuildingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await buildingsAPI.getById(id);
      return response?.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load Building');
    }
  }
);

// Slice
const buildingSlice = createSlice({
  name: 'building',
  initialState,
  reducers: {
    setSelectedBuilding: (state, action) => {
      const { id, building } = action.payload;
      state.selectedBuildingId = id ?? null;
      state.selectedBuilding = building ?? null;
      
      if (id) {
        setCookie(COOKIE_KEYS.BUILDING_ID, String(id));
      } else {
        removeCookie(COOKIE_KEYS.BUILDING_ID);
      }
    },
    clearSelectedBuilding: (state) => {
      state.selectedBuildingId = null;
      state.selectedBuilding = null;
      removeCookie(COOKIE_KEYS.BUILDING_ID);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBuildings.fulfilled, (state, action) => {
        state.buildings = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadBuildingById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedBuilding = action.payload;
        }
      });
  },
});

export const { setSelectedBuilding, clearSelectedBuilding } = buildingSlice.actions;
export default buildingSlice.reducer;

