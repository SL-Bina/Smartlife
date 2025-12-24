// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mock data - real API hazır olduqda comment-ə alınacaq
const mockResidentsData = Array.from({ length: 50 }, (_, index) => {
  const isLegalEntity = index % 3 === 0;
  const type = isLegalEntity ? "legal" : "physical";

  return {
    id: index + 1,
    fullName: isLegalEntity ? `Şirkət ${index + 1} MMC` : `Sakin ${index + 1} Ad Soyad`,
    phone: `050-000-${String(index + 1).padStart(2, "0")}`,
    email: `sakin${index + 1}@mail.com`,
    apartment: `Mənzil ${Math.floor(index / 2) + 1}`,
    block: `Blok ${String.fromCharCode(65 + (index % 5))}`,
    floor: Math.floor(index / 5) + 1,
    status: index % 2 === 0 ? "Aktiv" : "Passiv",
    type: type,
    fin: isLegalEntity ? null : `123456789${String(index).padStart(2, "0")}`,
    birthDate: isLegalEntity ? null : `199${index % 10}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
    gender: isLegalEntity ? null : (index % 2 === 0 ? "Kişi" : "Qadın"),
    voen: isLegalEntity ? `123456789${String(index).padStart(2, "0")}` : null,
    registrationDate: isLegalEntity ? `202${index % 4}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}` : null,
    address: `Bakı şəhəri, ${index + 1} küçəsi, ${index + 10} ev`,
    registrationAddress: `Bakı şəhəri, ${index + 5} küçəsi, ${index + 15} ev`,
    joinDate: `202${index % 4}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
    notes: index % 5 === 0 ? "Xüsusi qeydlər burada yer alır" : "",
    emergencyContact: `Fövqəladə hal üçün: ${String(index + 100).padStart(3, "0")}-${String(index + 1).padStart(2, "0")}-${String(index + 10).padStart(2, "0")}`,
    paymentMethod: index % 3 === 0 ? "Kart" : index % 3 === 1 ? "Nağd" : "Bank köçürməsi",
    balance: (index * 100) - (index * 50),
  };
});

/**
 * Sakinlərin siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Sakinlərin siyahısı və pagination məlumatları
 */
export const fetchResidents = async (filters = {}, page = 1, itemsPerPage = 10) => {
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
    // const response = await fetch(`${API_BASE_URL}/management/residents?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch residents");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter logic
        let filtered = [...mockResidentsData];
        if (filters.fullName) {
          filtered = filtered.filter((item) =>
            item.fullName.toLowerCase().includes(filters.fullName.toLowerCase())
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
    console.error("Error fetching residents:", error);
    throw error;
  }
};

/**
 * Yeni sakin yaradır
 * @param {Object} residentData - Sakin məlumatları
 * @returns {Promise<Object>} Yaradılmış sakin
 */
export const createResident = async (residentData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/management/residents`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(residentData),
    // });
    // if (!response.ok) throw new Error("Failed to create resident");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const newResident = {
          id: mockResidentsData.length + 1,
          ...residentData,
        };
        resolve(newResident);
      }, 300);
    });
  } catch (error) {
    console.error("Error creating resident:", error);
    throw error;
  }
};

/**
 * Sakini yeniləyir
 * @param {number} id - Sakin ID
 * @param {Object} residentData - Yenilənmiş sakin məlumatları
 * @returns {Promise<Object>} Yenilənmiş sakin
 */
export const updateResident = async (id, residentData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/management/residents/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(residentData),
    // });
    // if (!response.ok) throw new Error("Failed to update resident");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedResident = {
          id,
          ...residentData,
        };
        resolve(updatedResident);
      }, 300);
    });
  } catch (error) {
    console.error("Error updating resident:", error);
    throw error;
  }
};

/**
 * Sakini silir
 * @param {number} id - Sakin ID
 * @returns {Promise<void>}
 */
export const deleteResident = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/management/residents/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to delete resident");
    // return;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  } catch (error) {
    console.error("Error deleting resident:", error);
    throw error;
  }
};

/**
 * Sakin məlumatlarını gətirir
 * @param {number} id - Sakin ID
 * @returns {Promise<Object>} Sakin məlumatları
 */
export const fetchResidentById = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/management/residents/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch resident");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const resident = mockResidentsData.find((item) => item.id === id);
        resolve(resident || null);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching resident:", error);
    throw error;
  }
};

