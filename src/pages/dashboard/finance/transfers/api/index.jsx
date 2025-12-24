// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mock data - real API hazır olduqda comment-ə alınacaq
const mockTransfersData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  fromAccount: index % 2 === 0 ? "Nağd" : "Bank",
  toAccount: index % 2 === 0 ? "Bank" : "Nağd",
  amount: (200 + (index % 15) * 100).toFixed(2),
  transferDate: `2025-11-${String(1 + (index % 20)).padStart(2, "0")}`,
  description: `Köçürmə ${index + 1}`,
  status: index % 3 === 0 ? "Tamamlanıb" : "Gözləyir",
  referenceNumber: `TRF-${String(1000 + index).padStart(4, "0")}`,
}));

/**
 * Köçürmələrin siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Köçürmələrin siyahısı və pagination məlumatları
 */
export const fetchTransfers = async (filters = {}, page = 1, itemsPerPage = 10) => {
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
    // const response = await fetch(`${API_BASE_URL}/finance/transfers?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch transfers");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter logic
        let filtered = [...mockTransfersData];
        if (filters.fromAccount) {
          filtered = filtered.filter((item) =>
            item.fromAccount.toLowerCase().includes(filters.fromAccount.toLowerCase())
          );
        }
        if (filters.toAccount) {
          filtered = filtered.filter((item) =>
            item.toAccount.toLowerCase().includes(filters.toAccount.toLowerCase())
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
    console.error("Error fetching transfers:", error);
    throw error;
  }
};

/**
 * Ümumi tamamlanmış köçürmə məbləğini API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @returns {Promise<number>} Ümumi tamamlanmış köçürmə məbləği
 */
export const fetchTotalTransfers = async (filters = {}) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams(filters);
    // const response = await fetch(`${API_BASE_URL}/finance/transfers/total?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch total transfers");
    // const data = await response.json();
    // return data.total;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockTransfersData];
        if (filters.fromAccount) {
          filtered = filtered.filter((item) =>
            item.fromAccount.toLowerCase().includes(filters.fromAccount.toLowerCase())
          );
        }
        if (filters.toAccount) {
          filtered = filtered.filter((item) =>
            item.toAccount.toLowerCase().includes(filters.toAccount.toLowerCase())
          );
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }

        const total = filtered
          .filter((item) => item.status === "Tamamlanıb")
          .reduce((sum, item) => sum + parseFloat(item.amount), 0)
          .toFixed(2);

        resolve(parseFloat(total));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching total transfers:", error);
    throw error;
  }
};

/**
 * Yeni köçürmə yaradır
 * @param {Object} transferData - Köçürmə məlumatları
 * @returns {Promise<Object>} Yaradılmış köçürmə
 */
export const createTransfer = async (transferData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/transfers`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(transferData),
    // });
    // if (!response.ok) throw new Error("Failed to create transfer");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransfer = {
          id: mockTransfersData.length + 1,
          ...transferData,
          status: "Gözləyir",
          referenceNumber: `TRF-${String(1000 + mockTransfersData.length).padStart(4, "0")}`,
        };
        resolve(newTransfer);
      }, 300);
    });
  } catch (error) {
    console.error("Error creating transfer:", error);
    throw error;
  }
};

/**
 * Köçürməni yeniləyir
 * @param {number} id - Köçürmə ID
 * @param {Object} transferData - Yenilənmiş köçürmə məlumatları
 * @returns {Promise<Object>} Yenilənmiş köçürmə
 */
export const updateTransfer = async (id, transferData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/transfers/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(transferData),
    // });
    // if (!response.ok) throw new Error("Failed to update transfer");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedTransfer = {
          id,
          ...transferData,
        };
        resolve(updatedTransfer);
      }, 300);
    });
  } catch (error) {
    console.error("Error updating transfer:", error);
    throw error;
  }
};

/**
 * Köçürməni silir
 * @param {number} id - Köçürmə ID
 * @returns {Promise<void>}
 */
export const deleteTransfer = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/transfers/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to delete transfer");
    // return;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  } catch (error) {
    console.error("Error deleting transfer:", error);
    throw error;
  }
};

/**
 * Köçürmə məlumatlarını gətirir
 * @param {number} id - Köçürmə ID
 * @returns {Promise<Object>} Köçürmə məlumatları
 */
export const fetchTransferById = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/transfers/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch transfer");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const transfer = mockTransfersData.find((item) => item.id === id);
        resolve(transfer || null);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching transfer:", error);
    throw error;
  }
};

