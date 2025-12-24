// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mock data - real API hazır olduqda comment-ə alınacaq
import {
  getPaymentStatistics,
  getPaymentDynamicsData,
  getEmployeePerformanceData,
  getApplicationStatusData,
  getDepartmentStats,
  getResidentStats,
} from "@/data/dashboard-data";

/**
 * Ödəniş statistikalarını API-dən gətirir
 * @param {Function} t - Translation funksiyası
 * @returns {Promise<Array>} Ödəniş statistikaları
 */
export const fetchPaymentStatistics = async (t) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/dashboard/payment-statistics`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch payment statistics");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getPaymentStatistics(t));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching payment statistics:", error);
    throw error;
  }
};

/**
 * Ödəniş dinamikası məlumatlarını API-dən gətirir
 * @param {Function} t - Translation funksiyası
 * @returns {Promise<Object>} Ödəniş dinamikası məlumatları
 */
export const fetchPaymentDynamicsData = async (t) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/dashboard/payment-dynamics`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch payment dynamics");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getPaymentDynamicsData(t));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching payment dynamics:", error);
    throw error;
  }
};

/**
 * Əməkdaş performansı məlumatlarını API-dən gətirir
 * @param {Function} t - Translation funksiyası
 * @returns {Promise<Object>} Əməkdaş performansı məlumatları
 */
export const fetchEmployeePerformanceData = async (t) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/dashboard/employee-performance`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch employee performance");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getEmployeePerformanceData(t));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching employee performance:", error);
    throw error;
  }
};

/**
 * Müraciətlərin statusu məlumatlarını API-dən gətirir
 * @param {Function} t - Translation funksiyası
 * @returns {Promise<Array>} Müraciətlərin statusu məlumatları
 */
export const fetchApplicationStatusData = async (t) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/dashboard/application-status`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch application status");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getApplicationStatusData(t));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching application status:", error);
    throw error;
  }
};

/**
 * Şöbə statistikalarını API-dən gətirir
 * @param {Function} t - Translation funksiyası
 * @returns {Promise<Array>} Şöbə statistikaları
 */
export const fetchDepartmentStats = async (t) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/dashboard/department-stats`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch department stats");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getDepartmentStats(t));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching department stats:", error);
    throw error;
  }
};

/**
 * Sakin statistikalarını API-dən gətirir
 * @param {Function} t - Translation funksiyası
 * @returns {Promise<Array>} Sakin statistikaları
 */
export const fetchResidentStats = async (t) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/dashboard/resident-stats`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch resident stats");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getResidentStats(t));
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching resident stats:", error);
    throw error;
  }
};

/**
 * Bütün dashboard məlumatlarını bir dəfədə API-dən gətirir
 * @param {Function} t - Translation funksiyası
 * @returns {Promise<Object>} Bütün dashboard məlumatları
 */
export const fetchAllDashboardData = async (t) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const response = await fetch(`${API_BASE_URL}/dashboard/all`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch dashboard data");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(async () => {
        const [paymentStatistics, paymentDynamics, employeePerformance, applicationStatus, departmentStats, residentStats] =
          await Promise.all([
            fetchPaymentStatistics(t),
            fetchPaymentDynamicsData(t),
            fetchEmployeePerformanceData(t),
            fetchApplicationStatusData(t),
            fetchDepartmentStats(t),
            fetchResidentStats(t),
          ]);

        resolve({
          paymentStatistics,
          paymentDynamics,
          employeePerformance,
          applicationStatus,
          departmentStats,
          residentStats,
        });
      }, 200);
    });
  } catch (error) {
    console.error("Error fetching all dashboard data:", error);
    throw error;
  }
};

