// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;
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

// Mock data - real API hazır olduqda comment-ə alınacaq
const mockDebtorApartmentsData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  apartment: index === 0 ? "menzil_telefon_1" : `Mənzil ${index + 1}`,
  complex: "Port Baku Residence",
  building: `Bina ${String.fromCharCode(65 + (index % 5))}`,
  block: `Blok ${String.fromCharCode(65 + (index % 3))}`,
  floor: (index % 16) + 1,
  rooms: (index % 5) + 1,
  area: (60 + (index % 10) * 5).toFixed(2),
  owner: index % 2 === 0 ? `Sahib ${index + 1} ${String.fromCharCode(65 + (index % 3))}ov` : "-",
  phone: `050-${String(index + 1).padStart(7, "0")}`,
  totalDebt: (100 + (index % 20) * 10).toFixed(2),
  invoiceCount: index % 5 + 1,
  lastPaymentDate: index % 3 === 0 ? `2025-11-${String(19 - (index % 10)).padStart(2, "0")}` : "-",
  status: index % 3 === 0 ? "Ödənilib" : "Borclu",
}));

/**
 * Borclu mənzillərin siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Borclu mənzillərin siyahısı və pagination məlumatları
 */
export const fetchDebtorApartments = async (filters = {}, page = 1, itemsPerPage = 10) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams({
    //   page: page.toString(),
    //   per_page: itemsPerPage.toString(),
    //   ...filters,
    // });
    // const response = await fetch(`${API_BASE_URL}/finance/debtor-apartments?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch debtor apartments");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter logic - yalnız borcu olanları göstər
        let filtered = [...mockDebtorApartmentsData].filter((item) => {
          // Yalnız borcu olanları göstər
          const debt = parseFloat(item.totalDebt) || 0;
          return debt > 0;
        });
        
        if (filters.apartment) {
          filtered = filtered.filter((item) =>
            item.apartment.toLowerCase().includes(filters.apartment.toLowerCase())
          );
        }
        if (filters.owner) {
          filtered = filtered.filter((item) =>
            item.owner.toLowerCase().includes(filters.owner.toLowerCase())
          );
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }

        // Pagination
        const total = filtered.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const data = filtered.slice(startIndex, endIndex);

        resolve({
          data,
          pagination: {
            page,
            itemsPerPage,
            total,
            totalPages: Math.ceil(total / itemsPerPage),
          },
        });
      }, 400);
    });
  } catch (error) {
    console.error("Error fetching debtor apartments:", error);
    throw error;
  }
};

/**
 * Ümumi borc məbləğini API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @returns {Promise<number>} Ümumi borc məbləği
 */
export const fetchTotalDebt = async (filters = {}) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams(filters);
    // const response = await fetch(`${API_BASE_URL}/finance/debtor-apartments/total?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch total debt");
    // const data = await response.json();
    // return data.total;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Yalnız borcu olanları göstər
        let filtered = [...mockDebtorApartmentsData].filter((item) => {
          const debt = parseFloat(item.totalDebt) || 0;
          return debt > 0;
        });
        
        if (filters.apartment) {
          filtered = filtered.filter((item) =>
            item.apartment.toLowerCase().includes(filters.apartment.toLowerCase())
          );
        }
        if (filters.owner) {
          filtered = filtered.filter((item) =>
            item.owner.toLowerCase().includes(filters.owner.toLowerCase())
          );
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }

        const total = filtered
          .reduce((sum, item) => sum + parseFloat(item.totalDebt || 0), 0)
          .toFixed(2);

        resolve(parseFloat(total));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching total debt:", error);
    throw error;
  }
};

/**
 * Borc ödənişi edir
 * @param {number} id - Mənzil ID
 * @param {Object} paymentData - Ödəniş məlumatları
 * @returns {Promise<Object>} Ödəniş nəticəsi
 */
/**
 * @deprecated payInvoices istifadə edin
 * Köhnə ödəniş funksiyası - geriyə uyğunluq üçün saxlanılır
 */
export const payDebt = async (id, paymentData) => {
  // payInvoices-ə yönləndir
  const invoices = (paymentData.invoices || []).map((inv) => ({
    id: inv.id,
    amount_paid: inv.amount_paid ?? parseFloat(paymentData.amount ?? 0),
    payment_method_id: paymentData.payment_method_id,
    desc: paymentData.note || undefined,
    paid_at: paymentData.payment_date || undefined,
  }));
  return payInvoices(invoices.length ? invoices : [{
    id,
    amount_paid: parseFloat(paymentData.amount ?? 0),
    payment_method_id: paymentData.payment_method_id,
    desc: paymentData.note || undefined,
    paid_at: paymentData.payment_date || undefined,
  }]);
};

/**
 * Mənzil məlumatlarını gətirir
 * @param {number} id - Mənzil ID
 * @returns {Promise<Object>} Mənzil məlumatları
 */
export const fetchDebtorApartmentById = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/debtor-apartments/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch debtor apartment");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const apartment = mockDebtorApartmentsData.find((item) => item.id === id);
        resolve(apartment || null);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching debtor apartment:", error);
    throw error;
  }
};

/**
 * Mənzilin fakturalarını gətirir
 * @param {number} id - Mənzil ID
 * @returns {Promise<Array>} Fakturaların siyahısı
 */
export const fetchInvoices = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/debtor-apartments/${id}/invoices`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch invoices");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock invoices data
        const mockInvoices = [
          {
            id: 141786,
            invoiceNumber: `PBR...-854002635`,
            title: "test",
            date: "2025-12-31",
            status: "Ödənilməyib",
            amount: 150,
            paid: 0,
            remaining: 150,
          },
          {
            id: 141787,
            invoiceNumber: `PBR...-552659581`,
            title: "test",
            date: "2025-12-23",
            status: "Ödənilməyib",
            amount: 100,
            paid: 0,
            remaining: 100,
          },
        ];
        resolve(mockInvoices);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

/**
 * Excel-ə export edir
 * @param {Object} filters - Filter parametrləri
 * @returns {Promise<Blob>} Export edilmiş Excel faylı
 */
export const exportToExcel = async (filters = {}) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams(filters);
    // const response = await fetch(`${API_BASE_URL}/finance/debtor-apartments/export?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to export to Excel");
    // const blob = await response.blob();
    // return blob;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock Excel blob yaradırıq
        const csvContent = "Id,Mənzil,Mənzil sahibi,Bina,Blok,Mərtəbə,Otaq,Kv.m,Faktura sayı,Ümumi borc\n";
        const blob = new Blob([csvContent], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        resolve(blob);
      }, 300);
    });
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
};

