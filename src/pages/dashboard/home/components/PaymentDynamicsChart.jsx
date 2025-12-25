import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";

export function PaymentDynamicsChart({ options, series, height }) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Card className="border border-red-600 dark:border-gray-700/50 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 h-full flex flex-col rounded-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-black to-red-900 dark:from-gray-800 dark:to-gray-800 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b-2 border-red-600 dark:border-gray-700/50">
          <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
            {t("dashboard.charts.paymentDynamics")}
          </Typography>
        </CardHeader>
        <CardBody className="bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6 flex-1">
          <Chart options={options} series={series} type="line" height={height} />
        </CardBody>
      </Card>
    </motion.div>
  );
}

