import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";

export function PaymentDynamicsChart({ options, series, height }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 h-full flex flex-col rounded-xl">
      <CardHeader className="bg-black dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border border-red-600 dark:border-gray-700">
        <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
          {t("dashboard.charts.paymentDynamics")}
        </Typography>
      </CardHeader>
      <CardBody className="dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-0 flex-1">
        <Chart options={options} series={series} type="line" height={height} />
      </CardBody>
    </Card>
  );
}

