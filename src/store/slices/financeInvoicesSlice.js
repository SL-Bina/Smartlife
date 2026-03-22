import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  fetchInvoiceById,
  payInvoices,
} from '@/services/finance/invoicesApi';

const initialState = {
  invoices: [],
  totalPaid: 0,
  totalConsumption: 0,
  pagination: {
    page: 1,
    itemsPerPage: 20,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export const loadFinanceInvoices = createAsyncThunk(
  'financeInvoices/loadFinanceInvoices',
  async ({ filters = {}, page = 1, itemsPerPage = 20 } = {}, { rejectWithValue }) => {
    try {
      const mtkIds = filters?.['mtk_ids[]'];
      const hasMtkScope = Array.isArray(mtkIds) && mtkIds.length > 0 && mtkIds[0] !== null && mtkIds[0] !== undefined && mtkIds[0] !== '';

      if (!hasMtkScope) {
        return {
          invoices: [],
          pagination: { ...initialState.pagination, page, itemsPerPage },
          totalPaid: 0,
          totalConsumption: 0,
        };
      }

      const result = await fetchInvoices(filters, page, itemsPerPage);
      const invoices = result?.data || [];
      const totalPaid = invoices.reduce((sum, item) => sum + parseFloat(item.amount_paid || 0), 0);
      const totalConsumption = invoices.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

      return {
        invoices,
        pagination: result?.pagination || initialState.pagination,
        totalPaid: parseFloat(totalPaid.toFixed(2)),
        totalConsumption: parseFloat(totalConsumption.toFixed(2)),
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to load invoices');
    }
  }
);

export const createFinanceInvoice = createAsyncThunk(
  'financeInvoices/createFinanceInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      return await createInvoice(invoiceData);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to create invoice');
    }
  }
);

export const updateFinanceInvoice = createAsyncThunk(
  'financeInvoices/updateFinanceInvoice',
  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      return await updateInvoice(id, invoiceData);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to update invoice');
    }
  }
);

export const deleteFinanceInvoice = createAsyncThunk(
  'financeInvoices/deleteFinanceInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await deleteInvoice(id);
      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to delete invoice');
    }
  }
);

export const fetchFinanceInvoiceById = createAsyncThunk(
  'financeInvoices/fetchFinanceInvoiceById',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchInvoiceById(id);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to fetch invoice');
    }
  }
);

export const payFinanceInvoices = createAsyncThunk(
  'financeInvoices/payFinanceInvoices',
  async (invoices, { rejectWithValue }) => {
    try {
      return await payInvoices(invoices);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to pay invoices');
    }
  }
);

const financeInvoicesSlice = createSlice({
  name: 'financeInvoices',
  initialState,
  reducers: {
    clearFinanceInvoicesError: (state) => {
      state.error = null;
    },
    clearFinanceInvoices: (state) => {
      state.invoices = [];
      state.totalPaid = 0;
      state.totalConsumption = 0;
      state.pagination = { ...initialState.pagination };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFinanceInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFinanceInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.invoices;
        state.pagination = action.payload.pagination;
        state.totalPaid = action.payload.totalPaid;
        state.totalConsumption = action.payload.totalConsumption;
      })
      .addCase(loadFinanceInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Failed to load invoices';
      });
  },
});

export const { clearFinanceInvoicesError, clearFinanceInvoices } = financeInvoicesSlice.actions;

export const selectFinanceInvoices = (state) => state.financeInvoices.invoices;
export const selectFinanceInvoicesLoading = (state) => state.financeInvoices.loading;
export const selectFinanceInvoicesError = (state) => state.financeInvoices.error;
export const selectFinanceInvoicesPagination = (state) => state.financeInvoices.pagination;
export const selectFinanceInvoicesTotalPaid = (state) => state.financeInvoices.totalPaid;
export const selectFinanceInvoicesTotalConsumption = (state) => state.financeInvoices.totalConsumption;

export default financeInvoicesSlice.reducer;