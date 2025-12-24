import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";

export function DepartmentStatsChart({
  departmentStats,
  chartOptions,
  chartSeries,
  chartHeight,
}) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 h-full flex flex-col rounded-xl">
      <CardHeader className="bg-black dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border border-red-600 dark:border-gray-700">
        <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
          {t("dashboard.charts.departmentStats")}
        </Typography>
      </CardHeader>
      <CardBody className="dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6 flex-1">
        {/* Kiçik statistik kartlar - responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-5 sm:mb-6 lg:mb-8">
          {departmentStats.slice(0, 4).map((dept, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-5 rounded-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col shadow-sm"
            >
              <Typography
                variant="small"
                className="text-blue-gray-600 dark:text-gray-200 text-xs mb-3 font-semibold"
              >
                {t(dept.nameKey)}
              </Typography>
              <Typography
                variant="h6"
                className="text-blue-gray-900 dark:text-white font-bold text-sm mb-2"
              >
                {t("dashboard.departmentLabels.totalRequests")}: {dept.total}
              </Typography>
              <Typography
                variant="small"
                className="text-green-600 dark:text-green-300 text-xs mb-3"
              >
                {t("dashboard.departmentLabels.completed")}: {dept.completed}
              </Typography>
              <div className="mt-auto">
                <Typography
                  variant="small"
                  className="text-blue-gray-600 dark:text-gray-200 text-xs mb-2"
                >
                  {t("dashboard.departmentLabels.successRate")} {dept.successRate}%
                </Typography>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                  <div
                    className="bg-red-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${dept.successRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 5-ci kart - full width */}
        {departmentStats[4] && (
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-5 rounded-xl border border-gray-200 dark:border-gray-700 mb-5 sm:mb-6 lg:mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Typography
                variant="small"
                className="text-blue-gray-600 dark:text-gray-200 text-xs font-semibold"
              >
                {t(departmentStats[4].nameKey)}
              </Typography>
            </div>
            <div className="flex items-center justify-between mb-3">
              <Typography
                variant="h6"
                className="text-blue-gray-900 dark:text-white font-bold text-sm"
              >
                {t("dashboard.departmentLabels.totalRequests")}: {departmentStats[4].total}
              </Typography>
              <Typography
                variant="small"
                className="text-green-600 dark:text-green-300 text-xs"
              >
                {t("dashboard.departmentLabels.completed")}: {departmentStats[4].completed}
              </Typography>
            </div>
            <div>
              <Typography
                variant="small"
                className="text-blue-gray-600 dark:text-gray-200 text-xs mb-2"
              >
                {t("dashboard.departmentLabels.successRate")} {departmentStats[4].successRate}%
              </Typography>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div
                  className="bg-red-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${departmentStats[4].successRate}%` }}
                />
              </div>
            </div>
          </div>
        )}
        {/* Bar Chart */}
        <div className="mt-4 sm:mt-6">
          <Typography
            variant="small"
            className="text-blue-gray-600 dark:text-gray-200 mb-3 sm:mb-4 font-semibold text-xs sm:text-sm"
          >
            {t("dashboard.charts.requestCount")}
          </Typography>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={chartHeight}
          />
        </div>
      </CardBody>
    </Card>
  );
}

