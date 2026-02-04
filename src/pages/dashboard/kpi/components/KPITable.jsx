import React from "react";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function KPITable({ kpiData, loading }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
          {t("kpi.loading")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto min-w-[1600px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left sticky left-0 bg-gray-50 dark:bg-gray-800 z-10 min-w-[180px]">
              <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                {t("kpi.table.employeeInfo")}
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[150px]">
              <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                {t("kpi.table.totalWorkOrders")}
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[180px]">
              <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                {t("kpi.table.onTimeCompletion")}
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[200px]">
              <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                {t("kpi.table.priorityReport")}
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[180px]">
              <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                {t("kpi.table.averageCompletionTime")}
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[120px]">
              <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                {t("kpi.table.delay")}
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[200px]">
              <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                {t("kpi.table.utilization")}
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[150px]">
              <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                {t("kpi.table.repeatedRequests")}
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[180px]">
              <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                {t("kpi.table.averageResponseTime")}
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[220px]">
              <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                {t("kpi.table.workOrdersPerDay")}
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {kpiData.map((row, index) => (
            <tr
              key={row.id}
              className={`${
                index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"
              } hover:bg-blue-gray-50 dark:hover:bg-gray-800/70 transition-colors`}
            >
              <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800 sticky left-0 bg-inherit z-10">
                <div className="flex flex-col gap-1.5">
                  <Typography variant="small" className="font-semibold text-blue-gray-900 dark:text-white text-sm">
                    {row.employeeName}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-600 dark:text-gray-300 text-sm">
                    {row.employeeSurname}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-400 dark:text-gray-500 text-xs">
                    {row.department}
                  </Typography>
                </div>
              </td>
              <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                <div className="flex flex-col gap-1.5">
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                    {t("kpi.created")}: <span className="font-semibold">{row.totalCreated}</span>
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                    {t("kpi.completed")}: <span className="font-semibold">{row.totalClosed}</span>
                  </Typography>
                </div>
              </td>
              <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                <div className="flex flex-col gap-1.5">
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                    {t("kpi.count")}: <span className="font-semibold">{row.onTimeCompleted.count}</span>
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                    {t("kpi.percentage")}: <span className="font-semibold">{row.onTimeCompleted.percentage.toFixed(2)}%</span>
                  </Typography>
                </div>
              </td>
              <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                <div className="flex flex-col gap-1.5">
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                    <span className="font-medium">{t("kpi.medium")}</span> / {row.priorityReport.medium.count} / {row.priorityReport.medium.percentage.toFixed(2)}%
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                    <span className="font-medium">{t("kpi.high")}</span> / {row.priorityReport.high.count} / {row.priorityReport.high.percentage.toFixed(2)}%
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                    <span className="font-medium">{t("kpi.urgent")}</span> / {row.priorityReport.urgent.count} / {row.priorityReport.urgent.percentage.toFixed(2)}%
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                    <span className="font-medium">{t("kpi.low")}</span> / {row.priorityReport.low.count} / {row.priorityReport.low.percentage.toFixed(2)}%
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                    <span className="font-medium">{t("kpi.fiveMinute")}</span> / {row.priorityReport.fiveMinute.count} / {row.priorityReport.fiveMinute.percentage.toFixed(2)}%
                  </Typography>
                </div>
              </td>
              <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm font-medium">
                  {row.averageCompletionTime}
                </Typography>
              </td>
              <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm font-semibold">
                  {row.delayCount}
                </Typography>
              </td>
              <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                <div className="flex flex-col gap-1.5">
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                    {t("kpi.employeeWorkHours")}: <span className="font-semibold">{row.utilization.workHours}</span>
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                    {t("kpi.spentHours")}: <span className="font-semibold">{row.utilization.spentHours}</span>
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                    {t("kpi.percentage")}: <span className="font-semibold">{row.utilization.percentage.toFixed(2)}%</span>
                  </Typography>
                </div>
              </td>
              <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm font-semibold">
                  {row.repeatedRequests}
                </Typography>
              </td>
              <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm font-medium">
                  {row.averageResponseTime}
                </Typography>
              </td>
              <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                <div className="flex flex-col gap-1.5">
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                    {t("kpi.workOrdersPerDayCount")}: <span className="font-semibold">{row.workOrdersPerDay.perDay}</span>
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                    {t("kpi.totalWorkOrders")}: <span className="font-semibold">{row.workOrdersPerDay.total}</span>
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                    {t("kpi.daysCount")}: <span className="font-semibold">{row.workOrdersPerDay.days}</span>
                  </Typography>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

