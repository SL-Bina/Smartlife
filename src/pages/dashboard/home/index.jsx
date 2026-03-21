import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { Header } from "@/components/ui/Header";
import { useChartConfigs } from "@/hooks/dashboard/home";
import {
  StatisticsCards,
  PaymentDynamicsChart,
  EmployeePerformanceChart,
  ApplicationStatusChart,
  DepartmentStatsChart,
  ResidentStatsCards,
} from "@/components/dashboard/home";
import { useAppDispatch, useAppSelector, useMtkColor } from "@/store/hooks";
import {
  loadDashboardHomeData,
  selectDashboardHomeData,
  selectDashboardHomeError,
  selectDashboardHomeLoading,
} from "@/store/slices";

export function Home() {
  const { t } = useTranslation();
  const { getRgba: getMtkRgba } = useMtkColor();
  const dispatch = useAppDispatch();
  const dashboardData = useAppSelector(selectDashboardHomeData);
  const loading = useAppSelector(selectDashboardHomeLoading);
  const error = useAppSelector(selectDashboardHomeError);

  useEffect(() => {
    dispatch(loadDashboardHomeData());
  }, [dispatch]);

  const {
    getChartHeight,
    getPieChartHeight,
    paymentChartOptions,
    paymentChartSeries,
    employeeChartOptions,
    employeeChartSeries,
    pieChartOptions,
    pieChartSeries,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: getMtkRgba(0.7) }}></div>
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
      <Header
        icon={ChartBarIcon}
        title={t("statistics.pageTitle") || "Dashboard"}
        subtitle={
          t("statistics.pageSubtitle") ||
          "Ödənişlər, işçi performansı, müraciətlər və şöbə statistikaları"
        }
        className="mb-6"
      />
      <StatisticsCards paymentStatistics={dashboardData.paymentStatistics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6 mb-6">
        <ApplicationStatusChart
          options={pieChartOptions}
          series={pieChartSeries}
          height={getPieChartHeight()}
          windowWidth={windowWidth}
        />

        <DepartmentStatsChart
          departmentStats={dashboardData.departmentStats}
        />
      </div>

      <ResidentStatsCards residentStats={dashboardData.residentStats} />
    </div>
  );
}

export default Home;
