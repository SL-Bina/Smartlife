import React from "react";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { StatisticsCard } from "@/widgets/cards";
import { getPaymentStatistics } from "@/data/dashboard-data";

export function StatisticsCards({ paymentStatistics: paymentStatisticsFromProps }) {
  const { t } = useTranslation();
  // Use prop data if available, otherwise fallback to mock data
  const paymentStatistics = paymentStatisticsFromProps || getPaymentStatistics(t);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {paymentStatistics.map((stat, index) => (
        <StatisticsCard
          key={index}
          color="red"
          icon={React.createElement(stat.icon, { className: "w-6 h-6 text-white" })}
          title={t(stat.titleKey)}
          value={stat.value}
          footer={
            stat.subtitleKey ? (
              <Typography className="font-normal text-blue-gray-600 dark:text-gray-200 text-sm">
                {t(stat.subtitleKey)}
              </Typography>
            ) : null
          }
        />
      ))}
    </div>
  );
}

