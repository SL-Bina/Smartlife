// API Base URL - yalnız .env-dən gəlir (Vite üçün import.meta.env istifadə olunur)
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Reports məlumatlarını API-dən gətirir
 * @param {Object} filters - Filter parametrləri (startDate, endDate, currency)
 * @returns {Promise<Object>} Reports məlumatları
 */
export const fetchReports = async (filters = {}) => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams({
    //   start_date: filters.startDate || "",
    //   end_date: filters.endDate || "",
    //   currency: filters.currency || "AZN",
    // });
    // const response = await fetch(`${API_BASE_URL}/finance/reports?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to fetch reports");
    // const data = await response.json();
    // return data;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        const incomeData = {
          invoice: { total: 1199.0, bank: 0.0, cash: 1199.0 },
          deposit: { total: 14.0, bank: 0.0, cash: 14.0 },
          receivedLiabilities: { total: 0.0, bank: 0.0, cash: 0.0 },
          total: 1213.0,
        };

        const expenseData = {
          expenses: { total: 329.0, bank: 0.0, cash: 329.0 },
          returnedLiabilities: { total: 0.0, bank: 0.0, cash: 0.0 },
          total: 329.0,
        };

        const balanceData = {
          totalDepositBalance: { total: -637.09, bank: 3.05, cash: -640.14 },
          depositWithdrawn: { total: 363.67, bank: 0.0, cash: 363.67 },
          previousMonthBalances: { total: 1644.55, bank: 189.42 },
        };

        const profitLossData = {
          revenue: 1038.67,
          expense: 1367.67,
        };

        const previousMonthData = {
          income: 1644.55,
          paid: 1018.0,
          cashBankBalance: 2528.55,
          centralDebt: 2333.55,
          centralDebtValue: -90.0,
          currentMonthEndBalance: { total: 2528.55, bank: 189.42, cash: 2339.13 },
        };

        const residentsReceivablesData = [
          {
            dateRange: "01.11.2025 - 30.11.2025",
            totalApartments: 5,
            indebtedApartments: 5,
            indebtedInvoices: 9,
            debtAmount: 540.0,
          },
          {
            dateRange: "01.01.2023 - 24.11.2025",
            totalApartments: 10,
            indebtedApartments: 10,
            indebtedInvoices: 46,
            debtAmount: 2113.0,
          },
        ];

        resolve({
          income: incomeData,
          expenses: expenseData,
          balances: balanceData,
          profitLoss: profitLossData,
          previousMonth: previousMonthData,
          residentsReceivables: residentsReceivablesData,
        });
      }, 400);
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

/**
 * Reports-u export edir
 * @param {Object} filters - Filter parametrləri (startDate, endDate, currency)
 * @param {string} format - Export formatı (pdf, excel, csv)
 * @returns {Promise<Blob>} Export edilmiş fayl
 */
export const exportReport = async (filters = {}, format = "pdf") => {
  try {
    // Real API çağırışı - hazır olduqda comment-dən çıxarılacaq
    // if (!API_BASE_URL) {
    //   throw new Error("API_BASE_URL is not defined in .env file");
    // }
    // const queryParams = new URLSearchParams({
    //   start_date: filters.startDate || "",
    //   end_date: filters.endDate || "",
    //   currency: filters.currency || "AZN",
    //   format: format,
    // });
    // const response = await fetch(`${API_BASE_URL}/finance/reports/export?${queryParams}`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    // if (!response.ok) throw new Error("Failed to export report");
    // const blob = await response.blob();
    // return blob;

    // Mock data - real API hazır olduqda comment-ə alınacaq
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock blob yaradırıq
        const blob = new Blob(["Mock export data"], { type: "application/pdf" });
        resolve(blob);
      }, 300);
    });
  } catch (error) {
    console.error("Error exporting report:", error);
    throw error;
  }
};

