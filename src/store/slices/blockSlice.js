import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blocksAPI from '@/pages/dashboard/management/blocks/api';

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
  BLOCK_ID: 'smartlife_block_id',
};

// Initial state
const initialState = {
  selectedBlockId: getCookie(COOKIE_KEYS.BLOCK_ID) ? parseInt(getCookie(COOKIE_KEYS.BLOCK_ID), 10) : null,
  selectedBlock: null,
  blocks: [],
  loading: false,
  error: null,
};

// Async thunks
export const loadBlocks = createAsyncThunk(
  'block/loadBlocks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await blocksAPI.getAll(params);
      return response?.data?.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load Blocks');
    }
  }
);

export const loadBlockById = createAsyncThunk(
  'block/loadBlockById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await blocksAPI.getById(id);
      return response?.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load Block');
    }
  }
);

// Slice
const blockSlice = createSlice({
  name: 'block',
  initialState,
  reducers: {
    setSelectedBlock: (state, action) => {
      const { id, block } = action.payload;
      state.selectedBlockId = id ?? null;
      state.selectedBlock = block ?? null;
      
      if (id) {
        setCookie(COOKIE_KEYS.BLOCK_ID, String(id));
      } else {
        removeCookie(COOKIE_KEYS.BLOCK_ID);
      }
    },
    clearSelectedBlock: (state) => {
      state.selectedBlockId = null;
      state.selectedBlock = null;
      removeCookie(COOKIE_KEYS.BLOCK_ID);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBlocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBlocks.fulfilled, (state, action) => {
        state.blocks = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadBlocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadBlockById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedBlock = action.payload;
        }
      });
  },
});

export const { setSelectedBlock, clearSelectedBlock } = blockSlice.actions;
export default blockSlice.reducer;

