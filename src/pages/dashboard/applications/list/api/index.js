// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mock data - real API hazır olduqda comment-ə alınacaq
const mockApplicationsData = Array.from({ length: 50 }, (_, index) => ({
  id: 583 - index,
  apartmentEmployee: index % 3 === 0 ? `Mənzil ${index + 1}` : "-",
  text: `Application text ${index + 1}`,
  department: index % 4 === 0 ? "Təmizlik" : index % 4 === 1 ? "Santexnika" : index % 4 === 2 ? "Elektrik" : "-",
  residentPriority: index % 3 === 0 ? "Normal" : index % 3 === 1 ? "Yüksək" : "Orta",
  operationPriority: index % 3 === 0 ? "Tecili" : index % 3 === 1 ? "5 deqiqelik" : "-",
  image: index % 7 === 0 ? "lightbulb" : "-",
  status: index % 4 === 0 ? "Gözləmədə" : index % 4 === 1 ? "Tamamlandı" : index % 4 === 2 ? "Ləğv edildi" : "Gözləmədə",
  date: `2025-11-${String(1 + (index % 20)).padStart(2, "0")}`,
  isNew: index % 5 === 0,
}));

/**
 * Müraciətlərin siyahısını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {number} page - Səhifə nömrəsi
 * @param {number} itemsPerPage - Hər səhifədə element sayı
 * @returns {Promise<Object>} Müraciətlərin siyahısı və pagination məlumatları
 */
export const fetchApplications = async (filters = {}, page = 1, itemsPerPage = 10) => {
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
    // const response = await fetch(`${API_BASE_URL}/applications?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch applications");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter logic
        let filtered = [...mockApplicationsData];
        if (filters.searchText) {
          filtered = filtered.filter(
            (item) =>
              item.text?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
              item.apartmentEmployee?.toLowerCase().includes(filters.searchText.toLowerCase())
          );
        }
        if (filters.apartment) {
          filtered = filtered.filter((item) =>
            item.apartmentEmployee?.toLowerCase().includes(filters.apartment.toLowerCase())
          );
        }
        if (filters.department) {
          filtered = filtered.filter((item) =>
            item.department?.toLowerCase().includes(filters.department.toLowerCase())
          );
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }
        if (filters.dateFrom) {
          filtered = filtered.filter((item) => item.date >= filters.dateFrom);
        }
        if (filters.dateTo) {
          filtered = filtered.filter((item) => item.date <= filters.dateTo);
        }
        if (filters.category) {
          filtered = filtered.filter((item) => item.department === filters.category);
        }

        const total = filtered.length;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filtered.slice(startIndex, endIndex);

        resolve({
          success: true,
          data: paginatedData,
          pagination: {
            page,
            itemsPerPage,
            total,
            totalPages: Math.ceil(total / itemsPerPage),
          },
        });
      }, 300);
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

/**
 * Müraciətin yaradılması
 * @param {Object} applicationData - Müraciət məlumatları
 * @returns {Promise<Object>} Yaradılmış müraciət
 */
export const createApplication = async (applicationData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/applications`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(applicationData),
    // });
    // if (!response.ok) throw new Error("Failed to create application");
    // const data = await response.json();
    // return data;

    // Mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const newApplication = {
          id: Math.max(...mockApplicationsData.map((a) => a.id)) + 1,
          ...applicationData,
          date: applicationData.date || new Date().toISOString().split("T")[0],
        };
        mockApplicationsData.unshift(newApplication);
        resolve({ success: true, data: newApplication });
      }, 300);
    });
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};

/**
 * Müraciətin yenilənməsi
 * @param {number} id - Müraciət ID
 * @param {Object} applicationData - Yenilənmiş müraciət məlumatları
 * @returns {Promise<Object>} Yenilənmiş müraciət
 */
export const updateApplication = async (id, applicationData) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify(applicationData),
    // });
    // if (!response.ok) throw new Error("Failed to update application");
    // const data = await response.json();
    // return data;

    // Mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockApplicationsData.findIndex((a) => a.id === id);
        if (index !== -1) {
          mockApplicationsData[index] = { ...mockApplicationsData[index], ...applicationData };
          resolve({ success: true, data: mockApplicationsData[index] });
        } else {
          throw new Error("Application not found");
        }
      }, 300);
    });
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
};

/**
 * Müraciətin silinməsi
 * @param {number} id - Müraciət ID
 * @returns {Promise<Object>} Silinmə nəticəsi
 */
export const deleteApplication = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    //   method: "DELETE",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to delete application");
    // const data = await response.json();
    // return data;

    // Mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockApplicationsData.findIndex((a) => a.id === id);
        if (index !== -1) {
          mockApplicationsData.splice(index, 1);
          resolve({ success: true });
        } else {
          throw new Error("Application not found");
        }
      }, 300);
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

/**
 * Ümumi müraciətlərin sayını gətirir
 * @param {Object} filters - Filter parametrləri
 * @returns {Promise<number>} Ümumi müraciətlərin sayı
 */
export const fetchTotalApplications = async (filters = {}) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // Mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockApplicationsData];
        if (filters.searchText) {
          filtered = filtered.filter(
            (item) =>
              item.text?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
              item.apartmentEmployee?.toLowerCase().includes(filters.searchText.toLowerCase())
          );
        }
        if (filters.apartment) {
          filtered = filtered.filter((item) =>
            item.apartmentEmployee?.toLowerCase().includes(filters.apartment.toLowerCase())
          );
        }
        if (filters.department) {
          filtered = filtered.filter((item) =>
            item.department?.toLowerCase().includes(filters.department.toLowerCase())
          );
        }
        if (filters.status) {
          filtered = filtered.filter((item) => item.status === filters.status);
        }
        resolve(filtered.length);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching total applications:", error);
    throw error;
  }
};

