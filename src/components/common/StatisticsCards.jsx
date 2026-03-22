import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { getPaymentStatistics } from "@/data/dashboard-data";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { getIconComponent } from "@/utils/iconMapping";

export function StatisticsCards({ paymentStatistics: paymentStatisticsFromProps, loading = false }) {
  const { t } = useTranslation();
  const { colorCode, getRgba } = useMtkColor();
  // Use prop data if available, otherwise fallback to mock data
  const paymentStatistics = paymentStatisticsFromProps || getPaymentStatistics(t);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-pulse">
        {[...Array(3)].map((_, index) => (
          <Card
            key={`statistics-skeleton-${index}`}
            className="dark:border-gray-700/50 shadow-xl dark:shadow-gray-900/50 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden h-full"
          >
            <CardBody className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-200 dark:bg-gray-700 mb-4" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-36" />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {paymentStatistics.map((stat, index) => (
        <div key={index}>
          <Card className=" dark:border-gray-700/50 shadow-xl dark:shadow-gray-900/50 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden h-full transition-all duration-300">
              <CardBody className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${getRgba(0.9)}, ${getRgba(1)})`, boxShadow: `0 10px 15px -3px ${getRgba(0.3)}` }}>
                  {React.createElement(getIconComponent(stat.icon), { className: "w-6 h-6 sm:w-7 sm:h-7 text-white" })}
                </div>
              </div>
              <Typography
                variant="h3"
                className="text-gray-900 dark:text-white font-bold text-2xl sm:text-3xl mb-2"
              >
                {stat.value}
              </Typography>
              <Typography
                variant="h6"
                className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base mb-3"
              >
                {t(stat.titleKey)}
              </Typography>

            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
}

