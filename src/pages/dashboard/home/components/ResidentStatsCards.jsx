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
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="cursor-pointer"
        >
          <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 text-center p-3 sm:p-4 lg:p-6 h-full flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] rounded-xl">
            <div className="mb-2 sm:mb-3 lg:mb-4 flex justify-center">
              {React.createElement(stat.icon, {
                className:
                  "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-600 dark:text-red-400",
              })}
            </div>
            <Typography
              variant="h4"
              color="blue-gray"
              className="dark:text-white font-bold mb-2 sm:mb-3 text-lg sm:text-xl lg:text-2xl"
            >
              {stat.value}
            </Typography>
            <Typography
              variant="small"
              className="text-blue-gray-600 dark:text-gray-200 text-[10px] sm:text-xs mb-2 sm:mb-3 lg:mb-4 leading-tight px-1 sm:px-2"
            >
              {t(stat.titleKey)}
            </Typography>
            <Typography
              variant="small"
              className="text-blue-600 dark:text-blue-300 text-[10px] sm:text-xs font-semibold hover:underline"
            >
              {t("dashboard.residentStats.details")}
            </Typography>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

