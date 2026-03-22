import React from "react";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Chart from "react-apexcharts";
import { useMtkColor } from "@/store/hooks/useMtkColor";

export function PaymentDynamicsChart({ options, series, height, loading = false }) {
  const { t } = useTranslation();
  const { getRgba } = useMtkColor();
  return (
    <div>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden h-full flex flex-col">
        <div className="px-5 py-4 flex items-center gap-3 flex-shrink-0" style={{ background: `linear-gradient(to right, ${getRgba(0.95)}, ${getRgba(0.75)})` }}>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <CurrencyDollarIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold text-sm sm:text-base">
            {t("dashboard.charts.paymentDynamics")}
          </Typography>
        </div>
        <div className="p-4 sm:p-6 flex-1">
          {loading ? (
            <div className="animate-pulse h-full space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-[180px] sm:h-[220px] bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          ) : (
            <Chart options={options} series={series} type="line" height={height} />
          )}
        </div>
      </div>
    </div>
  );
}
