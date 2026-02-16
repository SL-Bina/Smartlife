import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertiesAPI from '@/pages/dashboard/management/properties/api';

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
  PROPERTY_ID: 'smartlife_property_id',
};

// Initial state
const initialState = {
  selectedPropertyId: getCookie(COOKIE_KEYS.PROPERTY_ID) ? parseInt(getCookie(COOKIE_KEYS.PROPERTY_ID), 10) : null,
  selectedProperty: null,
  properties: [],
  loading: false,
  error: null,
};

// Async thunks
export const loadProperties = createAsyncThunk(
  'property/loadProperties',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await propertiesAPI.getAll(params);
      return response?.data?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load Properties');
    }
  }
);

export const loadPropertyById = createAsyncThunk(
  'property/loadPropertyById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await propertiesAPI.getById(id);
      return response?.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load Property');
    }
  }
);

// Slice
const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setSelectedProperty: (state, action) => {
      const { id, property } = action.payload;
      state.selectedPropertyId = id ?? null;
      state.selectedProperty = property ?? null;
      
      if (id) {
        setCookie(COOKIE_KEYS.PROPERTY_ID, String(id));
      } else {
        removeCookie(COOKIE_KEYS.PROPERTY_ID);
      }
    },
    clearSelectedProperty: (state) => {
      state.selectedPropertyId = null;
      state.selectedProperty = null;
      removeCookie(COOKIE_KEYS.PROPERTY_ID);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProperties.fulfilled, (state, action) => {
        state.properties = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadPropertyById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedProperty = action.payload;
        }
      });
  },
});

export const { setSelectedProperty, clearSelectedProperty } = propertySlice.actions;
export default propertySlice.reducer;

