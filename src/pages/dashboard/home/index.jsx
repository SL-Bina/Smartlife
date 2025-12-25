import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useChartConfigs } from "./hooks/useChartConfigs";
import { StatisticsCards } from "./components/StatisticsCards";
import { PaymentDynamicsChart } from "./components/PaymentDynamicsChart";
import { EmployeePerformanceChart } from "./components/EmployeePerformanceChart";
import { ApplicationStatusChart } from "./components/ApplicationStatusChart";
import { DepartmentStatsChart } from "./components/DepartmentStatsChart";
import { ResidentStatsCards } from "./components/ResidentStatsCards";
import { fetchAllDashboardData } from "./api";
import { StatisticsHeader } from "./components/StatisticsHeader";

export function Home() {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState({
    paymentStatistics: null,
    paymentDynamics: null,
    employeePerformance: null,
    applicationStatus: null,
    departmentStats: null,
    residentStats: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllDashboardData(t);
        setDashboardData(data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [t]);

  const {
    getChartHeight,
    getPieChartHeight,
    paymentChartOptions,
    paymentChartSeries,
    employeeChartOptions,
    employeeChartSeries,
    pieChartOptions,
    pieChartSeries,
    departmentChartOptions,
    departmentChartSeries,
    windowWidth,
  } = useChartConfigs(
    dashboardData.paymentDynamics,
    dashboardData.employeePerformance,
    dashboardData.applicationStatus,
    dashboardData.departmentStats
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Xəta: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <StatisticsHeader />
      <StatisticsCards paymentStatistics={dashboardData.paymentStatistics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-16">
        <PaymentDynamicsChart
          options={paymentChartOptions}
          series={paymentChartSeries}
          height={getChartHeight(250, 300, 380)}
        />

        <EmployeePerformanceChart
          options={employeeChartOptions}
          series={employeeChartSeries}
          height={getChartHeight(250, 300, 380)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-16 mb-12">
        <ApplicationStatusChart
          options={pieChartOptions}
          series={pieChartSeries}
          height={getPieChartHeight()}
          windowWidth={windowWidth}
        />

        <DepartmentStatsChart
          departmentStats={dashboardData.departmentStats}
          chartOptions={departmentChartOptions}
          chartSeries={departmentChartSeries}
          chartHeight={getChartHeight(180, 200, 220)}
        />
      </div>

      <ResidentStatsCards residentStats={dashboardData.residentStats} />
    </div>
  );
}

export default Home;
