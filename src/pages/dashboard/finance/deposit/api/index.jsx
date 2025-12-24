// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mock data - real API hazır olduqda comment-ə alınacaq
const mockDepositData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  apartment: `Mənzil ${index + 1}`,
  owner: `Sahib ${index + 1}`,
  amount: (100 + (index % 20) * 50).toFixed(2),
  paymentMethod: index % 2 === 0 ? "Nağd" : "Bank",
  depositDate: `2025-11-${String(1 + (index % 20)).padStart(2, "0")}`,
  status: index % 3 === 0 ? "Aktiv" : "Qaytarılıb",
  notes: `Qeyd ${index + 1}`,
}));

/**
 * Depozitlərin siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Depozitlərin siyahısı və pagination məlumatları
 */
export const fetchDeposits = async (filters = {}, page = 1, itemsPerPage = 10) => {
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
    // const response = await fetch(`${API_BASE_URL}/finance/deposits?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch deposits");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter logic
        let filtered = [...mockDepositData];
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
    console.error("Error fetching deposits:", error);
    throw error;
  }
};

/**
 * Ümumi depozit məbləğini API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @returns {Promise<number>} Ümumi depozit məbləği
 */
export const fetchTotalDeposit = async (filters = {}) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams(filters);
    // const response = await fetch(`${API_BASE_URL}/finance/deposits/total?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch total deposit");
    // const data = await response.json();
    // return data.total;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockDepositData];
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
          .filter((item) => item.status === "Aktiv")
          .reduce((sum, item) => sum + parseFloat(item.amount), 0)
          .toFixed(2);

        resolve(parseFloat(total));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching total deposit:", error);
    throw error;
  }
};

/**
 * Yeni depozit yaradır
 * @param {Object} depositData - Depozit məlumatları
 * @returns {Promise<Object>} Yaradılmış depozit
 */
export const createDeposit = async (depositData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/deposits`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(depositData),
    // });
    // if (!response.ok) throw new Error("Failed to create deposit");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDeposit = {
          id: mockDepositData.length + 1,
          ...depositData,
          status: "Aktiv",
        };
        resolve(newDeposit);
      }, 300);
    });
  } catch (error) {
    console.error("Error creating deposit:", error);
    throw error;
  }
};

/**
 * Depoziti yeniləyir
 * @param {number} id - Depozit ID
 * @param {Object} depositData - Yenilənmiş depozit məlumatları
 * @returns {Promise<Object>} Yenilənmiş depozit
 */
export const updateDeposit = async (id, depositData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/deposits/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(depositData),
    // });
    // if (!response.ok) throw new Error("Failed to update deposit");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedDeposit = {
          id,
          ...depositData,
        };
        resolve(updatedDeposit);
      }, 300);
    });
  } catch (error) {
    console.error("Error updating deposit:", error);
    throw error;
  }
};

/**
 * Depoziti silir
 * @param {number} id - Depozit ID
 * @returns {Promise<void>}
 */
export const deleteDeposit = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/deposits/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to delete deposit");
    // return;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  } catch (error) {
    console.error("Error deleting deposit:", error);
    throw error;
  }
};

/**
 * Depozit məlumatlarını gətirir
 * @param {number} id - Depozit ID
 * @returns {Promise<Object>} Depozit məlumatları
 */
export const fetchDepositById = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/finance/deposits/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch deposit");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const deposit = mockDepositData.find((item) => item.id === id);
        resolve(deposit || null);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching deposit:", error);
    throw error;
  }
};

