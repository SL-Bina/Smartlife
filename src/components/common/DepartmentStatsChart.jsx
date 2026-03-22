import React from "react";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { BuildingOfficeIcon, ChartPieIcon, CheckCircleIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/store/exports";

const DEPT_COLORS = [
  { bg: "bg-red-500", light: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", bar: "bg-red-500" },
  { bg: "bg-blue-500", light: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", bar: "bg-blue-500" },
  { bg: "bg-emerald-500", light: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" },
  { bg: "bg-purple-500", light: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", bar: "bg-purple-500" },
  { bg: "bg-amber-500", light: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" },
  { bg: "bg-cyan-500", light: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400", bar: "bg-cyan-500" },
];

export function DepartmentStatsChart({ departmentStats, loading = false }) {
  const { t } = useTranslation();
  const { getRgba } = useMtkColor();

  const stats = departmentStats || [];

  return (
    <div className="h-full">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden h-full flex flex-col">
        {/* Header */}
        {/* <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-4 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <BuildingOfficeIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold text-sm sm:text-base">
            {t("dashboard.charts.departmentStats") || "Şöbə statistikaları"}
          </Typography>
          <div className="ml-auto bg-white/20 rounded-full px-3 py-0.5">
            <span className="text-white text-xs font-semibold">{stats.length} {t("dashboard.charts.departments") || "şöbə"}</span>
          </div>
        </div> */}
        <div className="px-5 py-4 flex items-center gap-3 flex-shrink-0" style={{ background: `linear-gradient(to right, ${getRgba(0.95)}, ${getRgba(0.75)})` }}>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <BuildingOfficeIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold text-sm sm:text-base">
            {t("dashboard.charts.departmentStats")}
          </Typography>
        </div>

        {/* Summary row */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-700/50 flex-shrink-0 animate-pulse">
            {[...Array(2)].map((_, index) => (
              <div key={`department-summary-skeleton-${index}`} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-1.5 w-full">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-700/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ClipboardDocumentListIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.charts.totalRequests") || "Ümumi müraciət"}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  {stats.reduce((acc, d) => acc + (d.total || 0), 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircleIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("dashboard.charts.completedRequests") || "Tamamlanmış"}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  {stats.reduce((acc, d) => acc + (d.completed || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Department list */}
        <div className="flex-1 flex flex-col px-4 sm:px-5 py-3 gap-2">
          {loading ? (
            <div className="animate-pulse flex-1 flex flex-col gap-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={`department-row-skeleton-${index}`}
                  className="flex-1 flex flex-col justify-center gap-2 rounded-lg px-3 py-2 bg-gray-50/70 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          ) : stats.length === 0 ? (
            <div className="flex items-center justify-center flex-1 text-gray-400 dark:text-gray-500 text-sm">
              {t("common.noData") || "Məlumat yoxdur"}
            </div>
          ) : (
            stats.map((dept, index) => {
              const color = DEPT_COLORS[index % DEPT_COLORS.length];
              const rate = dept.successRate ?? 0;
              return (
                <div
                  key={dept.nameKey || index}
                  className="flex-1 flex flex-col justify-center gap-1.5 rounded-lg px-3 py-2 bg-gray-50/70 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/30"
                >
                  {/* Top row: dot + name + stats */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color.bg}`} />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                        {t(dept.nameKey) || dept.nameKey}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-bold text-gray-700 dark:text-gray-200">{dept.completed}</span>
                        <span className="mx-0.5">/</span>
                        {dept.total}
                      </span>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${color.light} ${color.text}`}>
                        {rate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color.bar}`}
                      style={{ width: `${Math.min(rate, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
