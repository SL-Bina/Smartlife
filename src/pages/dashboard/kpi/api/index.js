// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Mock data - real API hazır olduqda comment-ə alınacaq
const mockKPIData = [
  {
    id: 1,
    employeeName: "55newusertest2",
    employeeSurname: "55newusertest",
    department: "Təyin edilməyib",
    totalCreated: 0,
    totalClosed: 0,
    onTimeCompleted: { count: 0, percentage: 0.0 },
    priorityReport: {
      medium: { count: 0, percentage: 0.0 },
      high: { count: 0, percentage: 0.0 },
      urgent: { count: 0, percentage: 0.0 },
      low: { count: 0, percentage: 0.0 },
      fiveMinute: { count: 0, percentage: 0.0 },
    },
    averageCompletionTime: "0 dəq",
    delayCount: 0,
    utilization: {
      workHours: 24.5,
      spentHours: "0 dəq",
      percentage: 0.0,
    },
    repeatedRequests: 0,
    averageResponseTime: "0 dəq",
    workOrdersPerDay: {
      perDay: 0,
      total: 0,
      days: 20,
    },
  },
  {
    id: 2,
    employeeName: "Adgozel",
    employeeSurname: "Adgozelov",
    department: "Texniki şöbə",
    totalCreated: 5,
    totalClosed: 3,
    onTimeCompleted: { count: 0, percentage: 0.0 },
    priorityReport: {
      medium: { count: 1, percentage: 20.0 },
      high: { count: 1, percentage: 20.0 },
      urgent: { count: 3, percentage: 60.0 },
      low: { count: 0, percentage: 0.0 },
      fiveMinute: { count: 0, percentage: 0.0 },
    },
    averageCompletionTime: "269 saat, 36 dəq",
    delayCount: 3,
    utilization: {
      workHours: 68,
      spentHours: "807 saat, 40 dəq",
      percentage: 1187.74,
    },
    repeatedRequests: 0,
    averageResponseTime: "5 dəq",
    workOrdersPerDay: {
      perDay: 0.3,
      total: 5,
      days: 20,
    },
  },
  {
    id: 3,
    employeeName: "Ahmed",
    employeeSurname: "Ahmedov",
    department: "Texniki şöbə",
    totalCreated: 0,
    totalClosed: 0,
    onTimeCompleted: { count: 0, percentage: 0.0 },
    priorityReport: {
      medium: { count: 0, percentage: 0.0 },
      high: { count: 0, percentage: 0.0 },
      urgent: { count: 0, percentage: 0.0 },
      low: { count: 0, percentage: 0.0 },
      fiveMinute: { count: 0, percentage: 0.0 },
    },
    averageCompletionTime: "0 dəq",
    delayCount: 0,
    utilization: {
      workHours: 0,
      spentHours: "0 dəq",
      percentage: 0.0,
    },
    repeatedRequests: 0,
    averageResponseTime: "0 dəq",
    workOrdersPerDay: {
      perDay: 0,
      total: 0,
      days: 20,
    },
  },
  {
    id: 4,
    employeeName: "Ahmed",
    employeeSurname: "Ahmedov",
    department: "Texniki şöbə",
    totalCreated: 12,
    totalClosed: 0,
    onTimeCompleted: { count: 0, percentage: 0.0 },
    priorityReport: {
      medium: { count: 8, percentage: 100.0 },
      high: { count: 0, percentage: 0.0 },
      urgent: { count: 0, percentage: 0.0 },
      low: { count: 0, percentage: 0.0 },
      fiveMinute: { count: 0, percentage: 0.0 },
    },
    averageCompletionTime: "0 dəq",
    delayCount: 0,
    utilization: {
      workHours: 0,
      spentHours: "2186 saat, 55 dəq",
      percentage: 0.0,
    },
    repeatedRequests: 0,
    averageResponseTime: "0 dəq",
    workOrdersPerDay: {
      perDay: 0.6,
      total: 12,
      days: 20,
    },
  },
];

/**
 * KPI məlumatlarını API-dən gətirir
 * @param {Object} filters - Filter parametrləri
 * @param {string} startDate - Başlanğıc tarixi
 * @param {string} endDate - Bitmə tarixi
 * @returns {Promise<Object>} KPI məlumatları
 */
export const fetchKPIData = async (filters = {}, startDate = "", endDate = "") => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams({
    //   start_date: startDate,
    //   end_date: endDate,
    //   ...filters,
    // });
    // const response = await fetch(`${API_BASE_URL}/kpi?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${getCookie(TOKEN_COOKIE_NAME)}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch KPI data");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockKPIData];

        if (filters.employeeName) {
          filtered = filtered.filter((item) =>
            item.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())
          );
        }
        if (filters.employeeSurname) {
          filtered = filtered.filter((item) =>
            item.employeeSurname.toLowerCase().includes(filters.employeeSurname.toLowerCase())
          );
        }
        if (filters.department) {
          filtered = filtered.filter((item) =>
            item.department.toLowerCase().includes(filters.department.toLowerCase())
          );
        }

        resolve({
          success: true,
          data: filtered,
        });
      }, 500);
    });
  } catch (error) {
    console.error("Error fetching KPI data:", error);
    throw error;
  }
};

/**
 * KPI məlumatlarını Excel formatında export edir
 * @param {Object} filters - Filter parametrləri
 * @param {string} startDate - Başlanğıc tarixi
 * @param {string} endDate - Bitmə tarixi
 * @returns {Promise<Blob>} Excel faylı
 */
export const exportKPIToExcel = async (filters = {}, startDate = "", endDate = "") => {
  try {
    // Real API çağırışı
    // const queryParams = new URLSearchParams({
    //   start_date: startDate,
    //   end_date: endDate,
    //   ...filters,
    // });
    // const response = await fetch(`${API_BASE_URL}/kpi/export/excel?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${getCookie(TOKEN_COOKIE_NAME)}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to export KPI to Excel");
    // const blob = await response.blob();
    // return blob;

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const blob = new Blob(["Mock Excel Data"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        resolve(blob);
      }, 500);
    });
  } catch (error) {
    console.error("Error exporting KPI to Excel:", error);
    throw error;
  }
};

/**
 * KPI məlumatlarını PDF formatında export edir
 * @param {Object} filters - Filter parametrləri
 * @param {string} startDate - Başlanğıc tarixi
 * @param {string} endDate - Bitmə tarixi
 * @returns {Promise<Blob>} PDF faylı
 */
export const exportKPIToPDF = async (filters = {}, startDate = "", endDate = "") => {
  try {
    // Real API çağırışı
    // const queryParams = new URLSearchParams({
    //   start_date: startDate,
    //   end_date: endDate,
    //   ...filters,
    // });
    // const response = await fetch(`${API_BASE_URL}/kpi/export/pdf?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${getCookie(TOKEN_COOKIE_NAME)}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to export KPI to PDF");
    // const blob = await response.blob();
    // return blob;

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const blob = new Blob(["Mock PDF Data"], { type: "application/pdf" });
        resolve(blob);
      }, 500);
    });
  } catch (error) {
    console.error("Error exporting KPI to PDF:", error);
    throw error;
  }
};

