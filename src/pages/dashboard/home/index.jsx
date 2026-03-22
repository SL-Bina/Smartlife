import React from "react";
import { useTranslation } from "react-i18next";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { Header } from "@/components/ui/Header";
import { useChartConfigs } from "@/hooks/dashboard/home";
import { getDepartmentStats } from "@/data/dashboard-data";

import {
  StatisticsCards,
  PaymentDynamicsChart,
  EmployeePerformanceChart,
  ApplicationStatusChart,
  DepartmentStatsChart,
  ResidentStatsCards,
} from "@/components";

export function Home() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const departmentStats = getDepartmentStats(t);

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
  } = useChartConfigs();

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
      <StatisticsCards loading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6">
        <PaymentDynamicsChart
          loading={isLoading}
          options={paymentChartOptions}
          series={paymentChartSeries}
          height={getChartHeight(250, 300, 380)}
        />

        <EmployeePerformanceChart
          loading={isLoading}
          options={employeeChartOptions}
          series={employeeChartSeries}
          height={getChartHeight(250, 300, 380)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6 mb-6">
        <ApplicationStatusChart
          loading={isLoading}
          options={pieChartOptions}
          series={pieChartSeries}
          height={getPieChartHeight()}
          windowWidth={windowWidth}
        />

        <DepartmentStatsChart loading={isLoading} departmentStats={departmentStats} />
      </div>

      <ResidentStatsCards loading={isLoading} />
    </div>
  );
}

export default Home;
