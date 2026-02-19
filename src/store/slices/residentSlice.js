import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import residentsAPI from '@/pages/dashboard/management/residents/api';

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
  RESIDENT_ID: 'smartlife_resident_id',
};

// Initial state
const initialState = {
  selectedResidentId: getCookie(COOKIE_KEYS.RESIDENT_ID) ? parseInt(getCookie(COOKIE_KEYS.RESIDENT_ID), 10) : null,
  selectedResident: null,
  residents: [],
  loading: false,
  error: null,
};

// Async thunks
export const loadResidents = createAsyncThunk(
  'resident/loadResidents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await residentsAPI.getAll(params);
      return response?.data?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load Residents');
    }
  }
);

export const loadResidentById = createAsyncThunk(
  'resident/loadResidentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await residentsAPI.getById(id);
      return response?.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load Resident');
    }
  }
);

// Slice
const residentSlice = createSlice({
  name: 'resident',
  initialState,
  reducers: {
    setSelectedResident: (state, action) => {
      const { id, resident } = action.payload;
      state.selectedResidentId = id ?? null;
      state.selectedResident = resident ?? null;
      
      if (id) {
        setCookie(COOKIE_KEYS.RESIDENT_ID, String(id));
      } else {
        removeCookie(COOKIE_KEYS.RESIDENT_ID);
      }
    },
    clearSelectedResident: (state) => {
      state.selectedResidentId = null;
      state.selectedResident = null;
      removeCookie(COOKIE_KEYS.RESIDENT_ID);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadResidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadResidents.fulfilled, (state, action) => {
        state.loading = false;
        state.residents = action.payload;
      })
      .addCase(loadResidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadResidentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadResidentById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Update selected resident if it matches
          if (state.selectedResidentId === action.payload.id) {
            state.selectedResident = action.payload;
          }
        }
      })
      .addCase(loadResidentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedResident, clearSelectedResident } = residentSlice.actions;
export default residentSlice.reducer;

