import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { getResidentStats } from "@/data/dashboard-data";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { getIconComponent } from "@/utils/iconMapping";

export function ResidentStatsCards({ residentStats: residentStatsFromProps, loading = false }) {
  const { t } = useTranslation();
  const { getRgba, colorCode } = useMtkColor();
  // Use prop data if available, otherwise fallback to mock data
  const residentStats = residentStatsFromProps || getResidentStats(t);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 animate-pulse">
        {[...Array(6)].map((_, index) => (
          <Card
            key={`resident-skeleton-${index}`}
            className="dark:border-gray-700/50 shadow-xl dark:shadow-gray-900/50 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 text-center p-3 sm:p-4 lg:p-6 h-full flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] rounded-2xl"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gray-200 dark:bg-gray-700 mb-3" />
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-14" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
      {residentStats.map((stat, index) => (
        <div key={index} className="cursor-pointer">
          <Card className=" dark:border-gray-700/50 shadow-xl dark:shadow-gray-900/50 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 text-center p-3 sm:p-4 lg:p-6 h-full flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] rounded-2xl transition-all duration-300">
            <div className="mb-2 sm:mb-3 lg:mb-4 flex justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: getRgba(0.12) }}>
                {React.createElement(getIconComponent(stat.icon), {
                  className: "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8",
                  style: { color: colorCode },
                })}
              </div>
            </div>
            <Typography
              variant="h4"
              className="text-gray-900 dark:text-white font-bold mb-2 sm:mb-3 text-lg sm:text-xl lg:text-2xl"
            >
              {stat.value}
            </Typography>
            <Typography
              variant="small"
              className="text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs mb-2 sm:mb-3 lg:mb-4 leading-tight px-1 sm:px-2 font-semibold"
            >
              {t(stat.titleKey)}
            </Typography>
            <Typography
              variant="small"
              className="text-[10px] sm:text-xs font-bold hover:underline transition-all"
              style={{ color: colorCode }}
            >
              {t("dashboard.residentStats.details")}
            </Typography>
          </Card>
        </div>
      ))}
    </div>
  );
}

