// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mock data - real API hazır olduqda comment-ə alınacaq
const mockInvoicesData = Array.from({ length: 50 }, (_, index) => ({
  id: 139653 - index,
  serviceName: `Xidmət ${index + 1}`,
  owner: `Sahib ${index + 1}`,
  ownerBalance: (Math.random() * 10).toFixed(2),
  apartment: `Mənzil ${index + 1}`,
  building: `Bina ${String.fromCharCode(65 + (index % 5))}`,
  block: `Blok ${String.fromCharCode(65 + (index % 3))}`,
  floor: (index % 16) + 1,
  area: (60 + (index % 10) * 5).toFixed(2),
  amount: (20 + (index % 10) * 5).toFixed(2),
  paidAmount: index % 3 === 0 ? (20 + (index % 10) * 5).toFixed(2) : (10 + (index % 5) * 2).toFixed(2),
  remaining: index % 3 === 0 ? "0.00" : (10 + (index % 5) * 3).toFixed(2),
  status: index % 3 === 0 ? "Ödənilib" : "Ödənilməmiş",
  invoiceDate: "2025 Noy",
  paymentDate: index % 3 === 0 ? `2025-11-${String(19 - (index % 10)).padStart(2, "0")} 17:01` : "",
  paymentMethod: index % 3 === 0 ? (index % 2 === 0 ? "Balans" : "Nağd") : "",
}));

/**
 * Faturaların siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Faturaların siyahısı və pagination məlumatları
 */
export const fetchInvoices = async (filters = {}, page = 1, itemsPerPage = 10) => {
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
    // const response = await fetch(`${API_BASE_URL}/finance/invoices?${queryParams}`, {
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
        // Filter logic
        let filtered = [...mockInvoicesData];
        if (filters.serviceName) {
          filtered = filtered.filter((item) =>
            item.serviceName.toLowerCase().includes(filters.serviceName.toLowerCase())
          );
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }
        if (filters.apartment) {
          filtered = filtered.filter((item) =>
            item.apartment.toLowerCase().includes(filters.apartment.toLowerCase())
          );
        }
        if (filters.building) {
          filtered = filtered.filter((item) =>
            item.building.toLowerCase().includes(filters.building.toLowerCase())
          );
        }
        if (filters.block) {
          filtered = filtered.filter((item) =>
            item.block.toLowerCase().includes(filters.block.toLowerCase())
          );
        }
        if (filters.floor) {
          filtered = filtered.filter((item) => item.floor === parseInt(filters.floor));
        }
        if (filters.dateStart) {
          // Date filtering logic - can be improved based on actual date format
          filtered = filtered.filter((item) => {
            // Mock implementation - adjust based on actual date format
            return true;
          });
        }
        if (filters.dateEnd) {
          // Date filtering logic - can be improved based on actual date format
          filtered = filtered.filter((item) => {
            // Mock implementation - adjust based on actual date format
            return true;
          });
        }
        if (filters.paymentDateStart) {
          // Payment date filtering logic
          filtered = filtered.filter((item) => {
            if (!item.paymentDate) return false;
            // Mock implementation - adjust based on actual date format
            return true;
          });
        }
        if (filters.paymentDateEnd) {
          // Payment date filtering logic
          filtered = filtered.filter((item) => {
            if (!item.paymentDate) return false;
            // Mock implementation - adjust based on actual date format
            return true;
          });
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
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams(filters);
    // const response = await fetch(`${API_BASE_URL}/finance/invoices/total-paid?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch total paid");
    // const data = await response.json();
    // return data.total;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockInvoicesData];
        if (filters.serviceName) {
          filtered = filtered.filter((item) =>
            item.serviceName.toLowerCase().includes(filters.serviceName.toLowerCase())
          );
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }
        if (filters.apartment) {
          filtered = filtered.filter((item) =>
            item.apartment.toLowerCase().includes(filters.apartment.toLowerCase())
          );
        }
        if (filters.building) {
          filtered = filtered.filter((item) =>
            item.building.toLowerCase().includes(filters.building.toLowerCase())
          );
        }
        if (filters.block) {
          filtered = filtered.filter((item) =>
            item.block.toLowerCase().includes(filters.block.toLowerCase())
          );
        }
        if (filters.floor) {
          filtered = filtered.filter((item) => item.floor === parseInt(filters.floor));
        }

        const total = filtered
          .reduce((sum, item) => sum + parseFloat(item.paidAmount), 0)
          .toFixed(2);

        resolve(parseFloat(total));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching total paid:", error);
    throw error;
  }
};

/**
 * Ümumi istehlak məbləğini API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @returns {Promise<number>} Ümumi istehlak məbləği
 */
export const fetchTotalConsumption = async (filters = {}) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams(filters);
    // const response = await fetch(`${API_BASE_URL}/finance/invoices/total-consumption?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch total consumption");
    // const data = await response.json();
    // return data.total;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockInvoicesData];
        if (filters.serviceName) {
          filtered = filtered.filter((item) =>
            item.serviceName.toLowerCase().includes(filters.serviceName.toLowerCase())
          );
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }
        if (filters.apartment) {
          filtered = filtered.filter((item) =>
            item.apartment.toLowerCase().includes(filters.apartment.toLowerCase())
          );
        }
        if (filters.building) {
          filtered = filtered.filter((item) =>
            item.building.toLowerCase().includes(filters.building.toLowerCase())
          );
        }
        if (filters.block) {
          filtered = filtered.filter((item) =>
            item.block.toLowerCase().includes(filters.block.toLowerCase())
          );
        }
        if (filters.floor) {
          filtered = filtered.filter((item) => item.floor === parseInt(filters.floor));
        }

        const total = filtered
          .reduce((sum, item) => sum + parseFloat(item.amount), 0)
          .toFixed(2);

        resolve(parseFloat(total));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching total consumption:", error);
    throw error;
  }
};

/**
 * Yeni faktura yaradır
 * @param {Object} invoiceData - Faktura məlumatları
 * @returns {Promise<Object>} Yaradılmış faktura
 */
export const createInvoice = async (invoiceData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/invoices`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(invoiceData),
    // });
    // if (!response.ok) throw new Error("Failed to create invoice");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const newInvoice = {
          id: 139653 - mockInvoicesData.length,
          ...invoiceData,
          status: "Ödənilməmiş",
          paidAmount: "0.00",
          remaining: invoiceData.amount,
        };
        resolve(newInvoice);
      }, 300);
    });
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
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/invoices/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(invoiceData),
    // });
    // if (!response.ok) throw new Error("Failed to update invoice");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedInvoice = {
          id,
          ...invoiceData,
        };
        resolve(updatedInvoice);
      }, 300);
    });
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
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/invoices/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to delete invoice");
    // return;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
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
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/invoices/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch invoice");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const invoice = mockInvoicesData.find((item) => item.id === id);
        resolve(invoice || null);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

