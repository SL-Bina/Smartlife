// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mock data - real API hazır olduqda comment-ə alınacaq
const mockApartmentData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  number: `Mənzil ${index + 1}`,
  block: `Blok ${String.fromCharCode(65 + (index % 5))}`,
  floor: (index % 16) + 1,
  area: 60 + (index % 10) * 5,
  resident: `Sakin ${index + 1}`,
  serviceFee: 20 + (index % 6) * 2,
  complex: `Kompleks ${Math.floor(index / 10) + 1}`,
  building: `Bina ${Math.floor(index / 5) + 1}`,
}));

// Mock servis haqqı tarixçəsi
const mockFeeHistoryData = [
  {
    id: 1,
    date: "2024-01-15",
    amount: 18,
    changedBy: "Admin",
    reason: "İlkin təyin",
  },
  {
    id: 2,
    date: "2024-03-20",
    amount: 20,
    changedBy: "Admin",
    reason: "Tarif artımı",
  },
  {
    id: 3,
    date: "2024-06-10",
    amount: 22,
    changedBy: "Admin",
    reason: "Tarif artımı",
  },
];

/**
 * Mənzil məlumatlarını API-dən gətirir
 * @param {number} id - Mənzil ID
 * @returns {Promise<Object>} Mənzil məlumatları
 */
export const fetchApartmentById = async (id) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/management/apartments/${id}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch apartment");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const apartment = mockApartmentData.find((a) => a.id === parseInt(id)) || {
          id: parseInt(id),
          number: `Mənzil ${id}`,
          block: "Blok A",
          floor: 1,
          area: 60,
          resident: `Sakin ${id}`,
          serviceFee: 20,
          complex: "Kompleks 1",
          building: "Bina 1",
        };
        resolve(apartment);
      }, 400);
    });
  } catch (error) {
    console.error("Error fetching apartment:", error);
    throw error;
  }
};

/**
 * Servis haqqı tarixçəsini API-dən gətirir
 * @param {number} apartmentId - Mənzil ID
 * @returns {Promise<Array>} Servis haqqı tarixçəsi
 */
export const fetchServiceFeeHistory = async (apartmentId) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/management/apartments/${apartmentId}/service-fee/history`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch service fee history");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockFeeHistoryData]);
      }, 200);
    });
  } catch (error) {
    console.error("Error fetching service fee history:", error);
    throw error;
  }
};

/**
 * Servis haqqını yeniləyir
 * @param {number} apartmentId - Mənzil ID
 * @param {number} newFee - Yeni servis haqqı
 * @param {string} reason - Dəyişiklik səbəbi
 * @returns {Promise<Object>} Yenilənmiş mənzil məlumatları
 */
export const updateServiceFee = async (apartmentId, newFee, reason) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/management/apartments/${apartmentId}/service-fee`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   body: JSON.stringify({
    //     serviceFee: newFee,
    //     reason: reason,
    //   }),
    // });
    // if (!response.ok) throw new Error("Failed to update service fee");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedApartment = {
          id: apartmentId,
          serviceFee: newFee,
        };
        resolve(updatedApartment);
      }, 1000);
    });
  } catch (error) {
    console.error("Error updating service fee:", error);
    throw error;
  }
};

