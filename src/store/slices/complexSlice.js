import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import complexesAPI from '@/pages/dashboard/management/complexes/api';

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
  COMPLEX_ID: 'smartlife_complex_id',
};

// Initial state
const initialState = {
  selectedComplexId: getCookie(COOKIE_KEYS.COMPLEX_ID) ? parseInt(getCookie(COOKIE_KEYS.COMPLEX_ID), 10) : null,
  selectedComplex: null,
  complexes: [],
  loading: false,
  error: null,
};

// Async thunks
export const loadComplexes = createAsyncThunk(
  'complex/loadComplexes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await complexesAPI.getAll(params);
      return response?.data?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load Complexes');
    }
  }
);

export const loadComplexById = createAsyncThunk(
  'complex/loadComplexById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await complexesAPI.getById(id);
      return response?.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load Complex');
    }
  }
);

// Slice
const complexSlice = createSlice({
  name: 'complex',
  initialState,
  reducers: {
    setSelectedComplex: (state, action) => {
      const { id, complex } = action.payload;
      state.selectedComplexId = id ?? null;
      state.selectedComplex = complex ?? null;
      
      if (id) {
        setCookie(COOKIE_KEYS.COMPLEX_ID, String(id));
      } else {
        removeCookie(COOKIE_KEYS.COMPLEX_ID);
      }
    },
    clearSelectedComplex: (state) => {
      state.selectedComplexId = null;
      state.selectedComplex = null;
      removeCookie(COOKIE_KEYS.COMPLEX_ID);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadComplexes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadComplexes.fulfilled, (state, action) => {
        state.complexes = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadComplexes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadComplexById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedComplex = action.payload;
        }
      });
  },
});

export const { setSelectedComplex, clearSelectedComplex } = complexSlice.actions;
export default complexSlice.reducer;

