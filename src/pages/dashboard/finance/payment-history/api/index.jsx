// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mock data - real API hazır olduqda comment-ə alınacaq
const mockPaymentHistoryData = Array.from({ length: 50 }, (_, index) => ({
  id: 86316 - index,
  payer: `Ödəniş edən ${index + 1}`,
  apartment: `Mənzil ${index + 1}`,
  building: index % 3 === 0 ? "-" : `Bina ${String.fromCharCode(65 + (index % 5))}`,
  block: `Blok ${String.fromCharCode(65 + (index % 3))}`,
  floor: (index % 16) + 1,
  area: (60 + (index % 10) * 5).toFixed(2),
  serviceDate: `2025-11-${String(1 + (index % 28)).padStart(2, "0")}`,
  amount: (20 + (index % 10) * 5).toFixed(2),
  paymentDate: `2025-11-${String(19 - (index % 10)).padStart(2, "0")} ${String(17 + (index % 5)).padStart(2, "0")}:${String(20 + (index % 40)).padStart(2, "0")}`,
  status: "Uğurlu",
  transactionType: "Mədaxil",
  paymentType: index % 2 === 0 ? "Nağd" : "Balans",
}));

/**
 * Ödəniş tarixçəsinin siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Ödəniş tarixçəsinin siyahısı və pagination məlumatları
 */
export const fetchPaymentHistory = async (filters = {}, page = 1, itemsPerPage = 10) => {
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
    // const response = await fetch(`${API_BASE_URL}/finance/payment-history?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch payment history");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter logic
        let filtered = [...mockPaymentHistoryData];
        if (filters.payer) {
          filtered = filtered.filter((item) =>
            item.payer.toLowerCase().includes(filters.payer.toLowerCase())
          );
        }
        if (filters.apartment) {
          filtered = filtered.filter((item) =>
            item.apartment.toLowerCase().includes(filters.apartment.toLowerCase())
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
    console.error("Error fetching payment history:", error);
    throw error;
  }
};

/**
 * Ümumi ödəniş məbləğini API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @returns {Promise<number>} Ümumi ödəniş məbləği
 */
export const fetchTotalAmount = async (filters = {}) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams(filters);
    // const response = await fetch(`${API_BASE_URL}/finance/payment-history/total?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch total amount");
    // const data = await response.json();
    // return data.total;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockPaymentHistoryData];
        if (filters.payer) {
          filtered = filtered.filter((item) =>
            item.payer.toLowerCase().includes(filters.payer.toLowerCase())
          );
        }
        if (filters.apartment) {
          filtered = filtered.filter((item) =>
            item.apartment.toLowerCase().includes(filters.apartment.toLowerCase())
          );
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }

        const total = filtered
          .reduce((sum, item) => sum + parseFloat(item.amount), 0)
          .toFixed(2);

        resolve(parseFloat(total));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching total amount:", error);
    throw error;
  }
};

/**
 * Ödəniş tarixçəsini yeniləyir
 * @param {number} id - Ödəniş ID
 * @param {Object} paymentData - Yenilənmiş ödəniş məlumatları
 * @returns {Promise<Object>} Yenilənmiş ödəniş
 */
export const updatePaymentHistory = async (id, paymentData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/payment-history/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(paymentData),
    // });
    // if (!response.ok) throw new Error("Failed to update payment history");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedPayment = {
          id,
          ...paymentData,
        };
        resolve(updatedPayment);
      }, 300);
    });
  } catch (error) {
    console.error("Error updating payment history:", error);
    throw error;
  }
};

/**
 * Ödəniş tarixçəsini silir
 * @param {number} id - Ödəniş ID
 * @returns {Promise<void>}
 */
export const deletePaymentHistory = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/payment-history/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to delete payment history");
    // return;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  } catch (error) {
    console.error("Error deleting payment history:", error);
    throw error;
  }
};

/**
 * Ödəniş tarixçəsi məlumatlarını gətirir
 * @param {number} id - Ödəniş ID
 * @returns {Promise<Object>} Ödəniş tarixçəsi məlumatları
 */
export const fetchPaymentHistoryById = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/payment-history/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch payment history");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = mockPaymentHistoryData.find((item) => item.id === id);
        resolve(payment || null);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};

