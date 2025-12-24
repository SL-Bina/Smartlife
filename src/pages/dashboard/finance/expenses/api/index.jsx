const API_BASE_URL = import.meta.env.VITE_API_URL;

const mockExpensesData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  category: ["Təmizlik", "Santexnika", "Elektrik", "Təmir", "Digər"][index % 5],
  description: `Xərc açıqlaması ${index + 1}`,
  amount: (50 + (index % 10) * 10).toFixed(2),
  paymentMethod: index % 2 === 0 ? "Nağd" : "Bank",
  paymentDate: `2025-11-${String(1 + (index % 20)).padStart(2, "0")}`,
  paidBy: `Ödəyən ${index + 1}`,
  invoiceNumber: `INV-${String(1000 + index).padStart(4, "0")}`,
  status: index % 3 === 0 ? "Təsdiqlənib" : "Gözləyir",
}));

/**
 * Xərclərin siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Xərclərin siyahısı və pagination məlumatları
 */
export const fetchExpenses = async (filters = {}, page = 1, itemsPerPage = 10) => {
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
    // const response = await fetch(`${API_BASE_URL}/finance/expenses?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch expenses");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter logic
        let filtered = [...mockExpensesData];
        if (filters.category) {
          filtered = filtered.filter((item) =>
            item.category.toLowerCase().includes(filters.category.toLowerCase())
          );
        }
        if (filters.paymentMethod) {
          filtered = filtered.filter((item) => item.paymentMethod === filters.paymentMethod);
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
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

/**
 * Ümumi xərc məbləğini API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @returns {Promise<number>} Ümumi xərc məbləği
 */
export const fetchTotalExpenses = async (filters = {}) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams(filters);
    // const response = await fetch(`${API_BASE_URL}/finance/expenses/total?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch total expenses");
    // const data = await response.json();
    // return data.total;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockExpensesData];
        if (filters.category) {
          filtered = filtered.filter((item) =>
            item.category.toLowerCase().includes(filters.category.toLowerCase())
          );
        }
        if (filters.paymentMethod) {
          filtered = filtered.filter((item) => item.paymentMethod === filters.paymentMethod);
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
    console.error("Error fetching total expenses:", error);
    throw error;
  }
};

/**
 * Yeni xərc yaradır
 * @param {Object} expenseData - Xərc məlumatları
 * @returns {Promise<Object>} Yaradılmış xərc
 */
export const createExpense = async (expenseData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/expenses`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(expenseData),
    // });
    // if (!response.ok) throw new Error("Failed to create expense");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const newExpense = {
          id: mockExpensesData.length + 1,
          ...expenseData,
          status: "Gözləyir",
        };
        resolve(newExpense);
      }, 300);
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

/**
 * Xərci yeniləyir
 * @param {number} id - Xərc ID
 * @param {Object} expenseData - Yenilənmiş xərc məlumatları
 * @returns {Promise<Object>} Yenilənmiş xərc
 */
export const updateExpense = async (id, expenseData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/expenses/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(expenseData),
    // });
    // if (!response.ok) throw new Error("Failed to update expense");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedExpense = {
          id,
          ...expenseData,
        };
        resolve(updatedExpense);
      }, 300);
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

/**
 * Xərci silir
 * @param {number} id - Xərc ID
 * @returns {Promise<void>}
 */
export const deleteExpense = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/expenses/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to delete expense");
    // return;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

/**
 * Xərc məlumatlarını gətirir
 * @param {number} id - Xərc ID
 * @returns {Promise<Object>} Xərc məlumatları
 */
export const fetchExpenseById = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/expenses/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch expense");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const expense = mockExpensesData.find((item) => item.id === id);
        resolve(expense || null);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching expense:", error);
    throw error;
  }
};

