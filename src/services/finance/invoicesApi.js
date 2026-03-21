import api from "@/services/api";

/**
 * Ödəniş metodlarını API-dən gətirir
 * GET /module/finance/payment/methods
 * @param {number} page - Səhifə nömrəsi
 * @param {number} perPage - Hər səhifədə element sayı
 * @returns {Promise<Array>} Ödəniş metodlarının siyahısı
 */
export const fetchPaymentMethods = async (page = 1, perPage = 100) => {
  try {
    const response = await api.get(`/module/finance/payment/methods?page=${page}&per_page=${perPage}`);
    if (response.data.success) {
      const payload = response.data.data;
      return Array.isArray(payload) ? payload : (payload?.data ?? []);
    }
    throw new Error(response.data.message || "Failed to fetch payment methods");
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
};

/**
 * Fakturalar üçün ödəniş edir
 * POST /module/finance/invoice/pay
 * @param {Array} invoices - [{id, amount_paid, payment_method_id, desc?, paid_at?}]
 * @returns {Promise<Object>} API cavabı
 */
export const payInvoices = async (invoices) => {
  try {
    const response = await api.post("/module/finance/invoice/pay", { invoices });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to pay invoices");
  } catch (error) {
    console.error("Error paying invoices:", error);
    throw error;
  }
};

/**
 * Faturaların siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Faturaların siyahısı və pagination məlumatları
 */
// ─── URL builder (handles arrays + range formats) ──────────────────────────
const buildParams = (filters = {}, page = 1, perPage = 20) => {
  const p = new URLSearchParams();
  p.append('page', String(page));
  p.append('per_page', String(perPage));

  const appendArrayValues = (keys = []) => {
    keys.forEach((key) => {
      const values = filters[key];
      if (!Array.isArray(values)) return;
      values.forEach((id) => {
        if (id !== null && id !== undefined && id !== "") {
          p.append(key, String(id));
        }
      });
    });
  };

  if (filters.status)     p.append('status',     filters.status);
  if (filters.type)       p.append('type',        filters.type);
  if (filters.invoice_id) p.append('invoice_id',  filters.invoice_id);

  // Arrays: service_ids[] / property_ids[]
  (filters['service_ids[]']  || []).forEach((id) => p.append('service_ids[]',  id));
  (filters['property_ids[]'] || []).forEach((id) => p.append('property_ids[]', id));
  appendArrayValues(['mtk_ids[]', 'complex_ids[]', 'building_ids[]', 'block_ids[]']);

  // Range: paid_at=2026-02-01_2026-02-14
  if (filters.paid_at)       p.append('paid_at',      filters.paid_at);
  // Range: amount=44.2_32.4 / amount_paid=44.2_32.4
  if (filters.amount)        p.append('amount',        filters.amount);
  if (filters.amount_paid)   p.append('amount_paid',   filters.amount_paid);

  return p;
};

export const fetchInvoices = async (filters = {}, page = 1, itemsPerPage = 20) => {
  try {
    const queryParams = buildParams(filters, page, itemsPerPage);
    const response = await api.get(`/search/module/finance/invoice?${queryParams}`);
    
    if (response.data.success) {
      const payload = response.data.data;
      const rawData = Array.isArray(payload)
        ? payload
        : (payload?.data ?? payload?.invoices ?? payload?.items ?? []);
      const getPropertyName = (p) => p && (p.name ?? p.meta?.apartment_number ?? p.apartment_number ?? (p.id != null ? `Mənzil #${p.id}` : null));
      const data = rawData.map((inv) => {
        const prop = inv.property || inv.apartment || inv.flat || inv.unit || inv.real_estate;
        let propertyResolved = null;
        if (prop != null) {
          propertyResolved = { ...prop, name: getPropertyName(prop) || prop.name };
        } else if (inv.property_id != null) {
          propertyResolved = { id: inv.property_id, name: `Mənzil #${inv.property_id}` };
        }
        return {
          ...inv,
          property: propertyResolved,
        };
      });
      const paginationPayload = Array.isArray(payload) ? {} : payload;
      return {
        data,
        pagination: {
          page: paginationPayload.current_page ?? page,
          itemsPerPage: paginationPayload.per_page ?? itemsPerPage,
          total: paginationPayload.total ?? data.length,
          totalPages: paginationPayload.last_page ?? 1,
        },
      };
    }
    
    throw new Error(response.data.message || "Failed to fetch invoices");
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

/**
 * Ümumi ödənilmiş məbləği API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @returns {Promise<number>} Ümumi ödənilmiş məbləğ
 */
export const fetchTotalPaid = async (filters = {}) => {
  try {
    const queryParams = buildParams(filters, 1, 9999);
    const response = await api.get(`/search/module/finance/invoice?${queryParams}`);
    
    if (response.data.success) {
      const invoices = response.data.data.data || [];
      const total = invoices
        .reduce((sum, item) => sum + parseFloat(item.amount_paid || 0), 0)
        .toFixed(2);
      return parseFloat(total);
    }
    
    return 0;
  } catch (error) {
    console.error("Error fetching total paid:", error);
    return 0;
  }
};

/**
 * Ümumi istehlak məbləğini API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @returns {Promise<number>} Ümumi istehlak məbləği
 */
export const fetchTotalConsumption = async (filters = {}) => {
  try {
    const queryParams = buildParams(filters, 1, 9999);
    const response = await api.get(`/search/module/finance/invoice?${queryParams}`);
    
    if (response.data.success) {
      const invoices = response.data.data.data || [];
      const total = invoices
        .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
        .toFixed(2);
      return parseFloat(total);
    }
    
    return 0;
  } catch (error) {
    console.error("Error fetching total consumption:", error);
    return 0;
  }
};

/**
 * Yeni faktura yaradır
 * @param {Object} invoiceData - Faktura məlumatları
 * @returns {Promise<Object>} Yaradılmış faktura
 */
export const createInvoice = async (invoiceData) => {
  try {
    const response = await api.put("/module/finance/invoice/add", invoiceData);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || "Failed to create invoice");
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

/**
 * Fakturanı yeniləyir
 * @param {number} id - Faktura ID
 * @param {Object} invoiceData - Yenilənmiş faktura məlumatları
 * @returns {Promise<Object>} Yenilənmiş faktura
 */
export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await api.patch(`/module/finance/invoice/${id}`, invoiceData);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || "Failed to update invoice");
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

/**
 * Fakturanı silir
 * @param {number} id - Faktura ID
 * @returns {Promise<void>}
 */
export const deleteInvoice = async (id) => {
  try {
    const response = await api.delete(`/module/finance/invoice/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete invoice");
    }
    
    return;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};

/**
 * Faktura məlumatlarını gətirir
 * @param {number} id - Faktura ID
 * @returns {Promise<Object>} Faktura məlumatları
 */
export const fetchInvoiceById = async (id) => {
  try {
    const response = await api.get(`/module/finance/invoice/${id}`);
    
    if (response.data.success) {
      const data = response.data.data;
      return {
        ...data,
        property: data.property || data.apartment || null,
      };
    }
    
    throw new Error(response.data.message || "Failed to fetch invoice");
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

