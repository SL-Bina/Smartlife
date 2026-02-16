import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mtkAPI from '@/pages/dashboard/management/mtk/api';

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

const COOKIE_KEYS = {
  MTK_ID: 'smartlife_mtk_id',
  MTK_COLOR_CODE: 'smartlife_mtk_color_code',
};

// Initial state
const initialState = {
  selectedMtkId: getCookie(COOKIE_KEYS.MTK_ID) ? parseInt(getCookie(COOKIE_KEYS.MTK_ID), 10) : null,
  selectedMtk: null,
  storedColorCode: getCookie(COOKIE_KEYS.MTK_COLOR_CODE),
  mtks: [],
  loading: false,
  error: null,
};

// Async thunks
export const loadMtks = createAsyncThunk(
  'mtk/loadMtks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await mtkAPI.getAll(params);
      return response?.data?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load MTKs');
    }
  }
);

export const loadMtkById = createAsyncThunk(
  'mtk/loadMtkById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await mtkAPI.getById(id);
      return response?.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load MTK');
    }
  }
);

// Slice
const mtkSlice = createSlice({
  name: 'mtk',
  initialState,
  reducers: {
    setSelectedMtk: (state, action) => {
      const { id, mtk } = action.payload;
      state.selectedMtkId = id ?? null;
      state.selectedMtk = mtk ?? null;
      
      const colorCode = mtk?.meta?.color_code || null;
      if (colorCode) {
        state.storedColorCode = colorCode;
        setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);
      }
      
      if (id) {
        setCookie(COOKIE_KEYS.MTK_ID, String(id));
      } else {
        document.cookie = `${COOKIE_KEYS.MTK_ID}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        document.cookie = `${COOKIE_KEYS.MTK_COLOR_CODE}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
      }
    },
    clearSelectedMtk: (state) => {
      state.selectedMtkId = null;
      state.selectedMtk = null;
      state.storedColorCode = null;
      document.cookie = `${COOKIE_KEYS.MTK_ID}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
      document.cookie = `${COOKIE_KEYS.MTK_COLOR_CODE}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    },
    updateStoredColor: (state, action) => {
      const { colorCode } = action.payload;
      if (colorCode) {
        state.storedColorCode = colorCode;
        setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // loadMtks
      .addCase(loadMtks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMtks.fulfilled, (state, action) => {
        state.mtks = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadMtks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // loadMtkById
      .addCase(loadMtkById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedMtk = action.payload;
          const colorCode = action.payload?.meta?.color_code;
          if (colorCode) {
            state.storedColorCode = colorCode;
            setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);
          }
        }
      });
  },
});

export const { setSelectedMtk, clearSelectedMtk, updateStoredColor } = mtkSlice.actions;
export default mtkSlice.reducer;

