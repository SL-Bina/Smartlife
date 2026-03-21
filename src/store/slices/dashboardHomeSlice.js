import { createLoadableSlice } from "./utils/createLoadableSlice";
import {
  getPaymentStatistics,
  getPaymentDynamicsData,
  getEmployeePerformanceData,
  getApplicationStatusData,
  getDepartmentStats,
  getResidentStats,
} from "@/data/dashboard-data";

const initialData = {
  data: {
    paymentStatistics: null,
    paymentDynamics: null,
    employeePerformance: null,
    applicationStatus: null,
    departmentStats: null,
    residentStats: null,
  },
};

const emptyDashboardData = {
  paymentStatistics: null,
  paymentDynamics: null,
  employeePerformance: null,
  applicationStatus: null,
  departmentStats: null,
  residentStats: null,
};

const { slice, loadData } = createLoadableSlice({
  name: "dashboardHome",
  initialData: initialData.data ?? emptyDashboardData,
  loadType: "dashboardHome/loadDashboardHomeData",
  loadErrorMessage: "Failed to load dashboard home data",
  loadFn: async () => {
    const data = {
      paymentStatistics: getPaymentStatistics(),
      paymentDynamics: getPaymentDynamicsData(),
      employeePerformance: getEmployeePerformanceData(),
      applicationStatus: getApplicationStatusData(),
      departmentStats: getDepartmentStats(),
      residentStats: getResidentStats(),
    };

    return await new Promise((resolve) => {
      setTimeout(() => resolve(data), 100);
    });
  },
});

export const loadDashboardHomeData = loadData;
export const { clearError: clearDashboardHomeError } = slice.actions;

export const selectDashboardHomeData = (state) => state.dashboardHome.data;
export const selectDashboardHomeLoading = (state) => state.dashboardHome.loading;
export const selectDashboardHomeError = (state) => state.dashboardHome.error;

export default slice.reducer;
