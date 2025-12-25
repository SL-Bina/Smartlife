import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getResidentStats } from "@/data/dashboard-data";

export function ResidentStatsCards({ residentStats: residentStatsFromProps }) {
  const { t } = useTranslation();
  // Use prop data if available, otherwise fallback to mock data
  const residentStats = residentStatsFromProps || getResidentStats(t);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
      {residentStats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
        >
          <Card className="border border-red-600 dark:border-gray-700/50 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 text-center p-3 sm:p-4 lg:p-6 h-full flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] rounded-2xl transition-all duration-300">
            <div className="mb-2 sm:mb-3 lg:mb-4 flex justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-red-600/10 to-red-500/5 dark:from-red-600/20 dark:to-red-500/10 flex items-center justify-center">
                {React.createElement(stat.icon, {
                  className:
                    "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-600 dark:text-red-400",
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
              className="text-red-600 dark:text-red-400 text-[10px] sm:text-xs font-bold hover:underline transition-all"
            >
              {t("dashboard.residentStats.details")}
            </Typography>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

