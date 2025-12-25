import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";

export function DepartmentStatsChart({
  departmentStats,
  chartOptions,
  chartSeries,
  chartHeight,
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className=" dark:border-gray-700/50 shadow-xl shadow-red-200/50 dark:shadow-gray-900/50 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 h-full flex flex-col rounded-2xl transition-all duration-300">
        <CardHeader className="bg-black dark:from-gray-800 dark:to-gray-800 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b-2 border-red-600 dark:border-gray-700/50">
          <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
            {t("dashboard.charts.departmentStats")}
          </Typography>
        </CardHeader>
        <CardBody className="rounded-2xl bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6 flex-1">
       
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-5 sm:mb-6 lg:mb-8">
            {departmentStats.slice(0, 4).map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 lg:p-5 rounded-xl border-2 border-red-600 dark:border-gray-700/50 h-full flex flex-col shadow-md"
              >
                <Typography
                  variant="small"
                  className="text-gray-700 dark:text-gray-200 text-xs mb-3 font-bold"
                >
                  {t(dept.nameKey)}
                </Typography>
                <Typography
                  variant="h6"
                  className="text-gray-900 dark:text-white font-bold text-sm mb-2"
                >
                  {t("dashboard.departmentLabels.totalRequests")}: {dept.total}
                </Typography>
                <Typography
                  variant="small"
                  className="text-green-600 dark:text-green-400 text-xs mb-3 font-semibold"
                >
                  {t("dashboard.departmentLabels.completed")}: {dept.completed}
                </Typography>
                <div className="mt-auto">
                  <Typography
                    variant="small"
                    className="text-gray-600 dark:text-gray-300 text-xs mb-2 font-medium"
                  >
                    {t("dashboard.departmentLabels.successRate")} {dept.successRate}%
                  </Typography>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-700 h-2.5 rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${dept.successRate}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* 5-ci kart - full width */}
          {departmentStats[4] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-4 lg:p-5 rounded-xl border-2 border-red-600 dark:border-gray-700/50 mb-5 sm:mb-6 lg:mb-8 shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <Typography
                  variant="small"
                  className="text-gray-700 dark:text-gray-200 text-xs font-bold"
                >
                  {t(departmentStats[4].nameKey)}
                </Typography>
              </div>
              <div className="flex items-center justify-between mb-3">
                <Typography
                  variant="h6"
                  className="text-gray-900 dark:text-white font-bold text-sm"
                >
                  {t("dashboard.departmentLabels.totalRequests")}: {departmentStats[4].total}
                </Typography>
                <Typography
                  variant="small"
                  className="text-green-600 dark:text-green-400 text-xs font-semibold"
                >
                  {t("dashboard.departmentLabels.completed")}: {departmentStats[4].completed}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="small"
                  className="text-gray-600 dark:text-gray-300 text-xs mb-2 font-medium"
                >
                  {t("dashboard.departmentLabels.successRate")} {departmentStats[4].successRate}%
                </Typography>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-700 h-2.5 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${departmentStats[4].successRate}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          {/* Bar Chart */}
          <div className="mt-4 sm:mt-6">
            <Typography
              variant="small"
              className="text-gray-700 dark:text-gray-200 mb-3 sm:mb-4 font-bold text-xs sm:text-sm"
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
    </motion.div>
  );
}

