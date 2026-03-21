import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie, setCookie, removeCookie } from "./cookieUtils";

export function createCrudEntitySlice({
  sliceName,
  api,
  cookieKey,
  listStateKey,
  selectedIdStateKey,
  selectedItemStateKey,
  selectedPayloadKey,
  listThunkType,
  byIdThunkType,
  loadListErrorMessage,
  loadByIdErrorMessage,
  extractList = (response) => response?.data?.data?.data || [],
  extractById = (response) => response?.data?.data || null,
  getInitialSelectedItem = () => null,
  persistSelectedItem,
  loadByIdAffectsLoading = false,
  additionalInitialState = {},
  additionalReducers = {},
  onSetSelected,
  onClearSelected,
  onLoadByIdFulfilled,
}) {
  const loadList = createAsyncThunk(
    listThunkType,
    async (params = {}, { rejectWithValue }) => {
      try {
        const response = await api.getAll(params);
        return extractList(response);
      } catch (error) {
        return rejectWithValue(error?.message || loadListErrorMessage);
      }
    }
  );

  const loadById = createAsyncThunk(
    byIdThunkType,
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.getById(id);
        return extractById(response);
      } catch (error) {
        return rejectWithValue(error?.message || loadByIdErrorMessage);
      }
    }
  );

  const initialState = {
    [selectedIdStateKey]: getCookie(cookieKey) ? parseInt(getCookie(cookieKey), 10) : null,
    [selectedItemStateKey]: getInitialSelectedItem(),
    [listStateKey]: [],
    loading: false,
    error: null,
    ...additionalInitialState,
  };

  const slice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
      setSelected: (state, action) => {
        const payload = action.payload || {};
        const id = payload.id ?? null;
        const selectedItem = selectedPayloadKey ? payload[selectedPayloadKey] ?? null : payload.item ?? null;

        state[selectedIdStateKey] = id;
        state[selectedItemStateKey] = selectedItem;

        if (id) {
          setCookie(cookieKey, String(id));
        } else {
          removeCookie(cookieKey);
        }

        if (persistSelectedItem?.set) {
          persistSelectedItem.set(selectedItem);
        }

        if (typeof onSetSelected === "function") {
          onSetSelected(state, { payload, id, selectedItem });
        }
      },
      clearSelected: (state) => {
        state[selectedIdStateKey] = null;
        state[selectedItemStateKey] = null;
        removeCookie(cookieKey);

        if (persistSelectedItem?.clear) {
          persistSelectedItem.clear();
        }

        if (typeof onClearSelected === "function") {
          onClearSelected(state);
        }
      },
      ...additionalReducers,
    },
    extraReducers: (builder) => {
      builder
        .addCase(loadList.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loadList.fulfilled, (state, action) => {
          state[listStateKey] = action.payload;
          state.loading = false;
          state.error = null;
        })
        .addCase(loadList.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });

      if (loadByIdAffectsLoading) {
        builder
          .addCase(loadById.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(loadById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
      }

      builder.addCase(loadById.fulfilled, (state, action) => {
        if (loadByIdAffectsLoading) {
          state.loading = false;
        }

        if (!action.payload) return;

        state[selectedItemStateKey] = action.payload;

        if (persistSelectedItem?.set) {
          persistSelectedItem.set(action.payload);
        }

        if (typeof onLoadByIdFulfilled === "function") {
          onLoadByIdFulfilled(state, action.payload);
        }
      });
    },
  });

  return {
    slice,
    loadList,
    loadById,
  };
}
