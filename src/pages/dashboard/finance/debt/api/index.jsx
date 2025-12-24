// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mock data - real API hazır olduqda comment-ə alınacaq
const mockDebtData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  creditor: `Alacaglı ${index + 1}`,
  debtor: index % 2 === 0 ? "Kompaniya" : "Fiziki şəxs",
  amount: (500 + (index % 20) * 200).toFixed(2),
  debtDate: `2025-11-${String(1 + (index % 20)).padStart(2, "0")}`,
  dueDate: `2025-12-${String(1 + (index % 20)).padStart(2, "0")}`,
  description: `Öhdəlik ${index + 1}`,
  status: index % 3 === 0 ? "Ödənilib" : "Aktiv",
  category: ["Xidmət", "Təchizat", "Kredit", "Digər"][index % 4],
}));

/**
 * Borcların siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Borcların siyahısı və pagination məlumatları
 */
export const fetchDebts = async (filters = {}, page = 1, itemsPerPage = 10) => {
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
    // const response = await fetch(`${API_BASE_URL}/finance/debts?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch debts");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter logic
        let filtered = [...mockDebtData];
        if (filters.creditor) {
          filtered = filtered.filter((item) =>
            item.creditor.toLowerCase().includes(filters.creditor.toLowerCase())
          );
        }
        if (filters.category) {
          filtered = filtered.filter((item) =>
            item.category.toLowerCase().includes(filters.category.toLowerCase())
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
    console.error("Error fetching debts:", error);
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
    // const response = await fetch(`${API_BASE_URL}/finance/debts/total?${queryParams}`, {
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
        let filtered = [...mockDebtData];
        if (filters.creditor) {
          filtered = filtered.filter((item) =>
            item.creditor.toLowerCase().includes(filters.creditor.toLowerCase())
          );
        }
        if (filters.category) {
          filtered = filtered.filter((item) =>
            item.category.toLowerCase().includes(filters.category.toLowerCase())
          );
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }

        const total = filtered
          .filter((item) => item.status === "Aktiv")
          .reduce((sum, item) => sum + parseFloat(item.amount), 0)
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
 * Yeni borc yaradır
 * @param {Object} debtData - Borc məlumatları
 * @returns {Promise<Object>} Yaradılmış borc
 */
export const createDebt = async (debtData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/debts`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(debtData),
    // });
    // if (!response.ok) throw new Error("Failed to create debt");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDebt = {
          id: mockDebtData.length + 1,
          ...debtData,
          status: "Aktiv",
        };
        resolve(newDebt);
      }, 300);
    });
  } catch (error) {
    console.error("Error creating debt:", error);
    throw error;
  }
};

/**
 * Borcu yeniləyir
 * @param {number} id - Borc ID
 * @param {Object} debtData - Yenilənmiş borc məlumatları
 * @returns {Promise<Object>} Yenilənmiş borc
 */
export const updateDebt = async (id, debtData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/debts/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(debtData),
    // });
    // if (!response.ok) throw new Error("Failed to update debt");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedDebt = {
          id,
          ...debtData,
        };
        resolve(updatedDebt);
      }, 300);
    });
  } catch (error) {
    console.error("Error updating debt:", error);
    throw error;
  }
};

/**
 * Borcu silir
 * @param {number} id - Borc ID
 * @returns {Promise<void>}
 */
export const deleteDebt = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/debts/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to delete debt");
    // return;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  } catch (error) {
    console.error("Error deleting debt:", error);
    throw error;
  }
};

/**
 * Borc məlumatlarını gətirir
 * @param {number} id - Borc ID
 * @returns {Promise<Object>} Borc məlumatları
 */
export const fetchDebtById = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/debts/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch debt");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const debt = mockDebtData.find((item) => item.id === id);
        resolve(debt || null);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching debt:", error);
    throw error;
  }
};

