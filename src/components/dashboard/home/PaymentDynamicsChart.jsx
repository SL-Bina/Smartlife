import React from "react";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Chart from "react-apexcharts";
import { useMtkColor } from "@/store/hooks/useMtkColor";

export function PaymentDynamicsChart({ options, series, height }) {
  const { t } = useTranslation();
  const { getRgba } = useMtkColor();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
          <Chart options={options} series={series} type="line" height={height} />
        </div>
      </div>
    </motion.div>
  );
}
