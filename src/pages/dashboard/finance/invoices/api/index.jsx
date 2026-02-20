import api from "@/services/api";

/**
 * Faturaların siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Faturaların siyahısı və pagination məlumatları
 */
export const fetchInvoices = async (filters = {}, page = 1, itemsPerPage = 20) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: itemsPerPage.toString(),
      ...filters,
    });
    
    const response = await api.get(`/module/finance/invoices?${queryParams}`);
    
    if (response.data.success) {
      return {
        data: response.data.data.data || [],
        pagination: {
          page: response.data.data.current_page || page,
          itemsPerPage: response.data.data.per_page || itemsPerPage,
          total: response.data.data.total || 0,
          totalPages: response.data.data.last_page || 1,
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
    const queryParams = new URLSearchParams(filters);
    const response = await api.get(`/module/finance/invoices?${queryParams}`);
    
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
    const queryParams = new URLSearchParams(filters);
    const response = await api.get(`/module/finance/invoices?${queryParams}`);
    
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
      return response.data.data;
    }
    
    throw new Error(response.data.message || "Failed to fetch invoice");
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

