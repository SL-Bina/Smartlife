import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export function createLoadableSlice({
  name,
  initialData,
  loadType,
  loadErrorMessage,
  loadFn,
}) {
  const loadData = createAsyncThunk(loadType, async (_, { rejectWithValue }) => {
    try {
      return await loadFn();
    } catch (error) {
      return rejectWithValue(error?.message || loadErrorMessage);
    }
  });

  const slice = createSlice({
    name,
    initialState: {
      data: initialData,
      loading: false,
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
          state.error = null;
          state.data = action.payload;
        })
        .addCase(loadData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || loadErrorMessage;
        });
    },
  });

  return { slice, loadData };
}
