import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";

export function ApplicationStatusChart({ options, series, height, windowWidth }) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className=" dark:border-gray-700/50 shadow-xl shadow-red-200/50 dark:shadow-gray-900/50 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 flex flex-col rounded-2xl  transition-all duration-300"
        style={{ height: "100%" }}
      >
        <CardHeader className="bg-black dark:from-gray-800 dark:to-gray-800 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 flex-shrink-0 border-b-2 border-red-600 dark:border-gray-700/50">
          <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
            {t("dashboard.charts.applicationStatus")}
          </Typography>
        </CardHeader>
        <CardBody className="rounded-2xl bg-white dark:bg-gray-800 px-2 sm:px-4 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6 flex items-center justify-center overflow-visible">
          <div
            className="w-full flex items-center justify-center"
            style={{
              maxWidth: "100%",
              minHeight: `${height}px`,
              minWidth: windowWidth >= 1024 ? `${height}px` : "100%",
            }}
          >
            <Chart
              options={options}
              series={series}
              type="pie"
              height={height}
              width={windowWidth >= 1024 ? height : "100%"}
            />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

