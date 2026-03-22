import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export function createLoadableSlice({
  name,
  initialData,
  loadType,
  loadErrorMessage,
  loadFn,
}) {
  const loadData = createAsyncThunk(
    loadType,
    async (payload, { rejectWithValue }) => {
      try {
        return await loadFn(payload);
      } catch (error) {
        return rejectWithValue(error?.message || loadErrorMessage);
      }
    },
    {
      condition: (payload, { getState }) => {
        if (payload?.force === true) return true;
        const sliceState = getState()?.[name];
        if (!sliceState) return true;
        if (sliceState.loading) return false;
        if (sliceState.loaded) return false;
        return true;
      },
    }
  );

  const slice = createSlice({
    name,
    initialState: {
      data: initialData,
      loading: false,
      loaded: false,
      error: null,
    },
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
      setData: (state, action) => {
        state.data = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loadData.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loadData.fulfilled, (state, action) => {
          state.loading = false;
          state.loaded = true;
          state.error = null;
          state.data = action.payload;
        })
        .addCase(loadData.rejected, (state, action) => {
          state.loading = false;
          state.loaded = false;
          state.error = action.payload || loadErrorMessage;
        });
    },
  });

  return { slice, loadData };
}
