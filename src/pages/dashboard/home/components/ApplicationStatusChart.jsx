import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import Chart from "react-apexcharts";

export function ApplicationStatusChart({ options, series, height, windowWidth }) {
  const { t } = useTranslation();

  return (
    <Card
      className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 flex flex-col rounded-xl"
      style={{ minHeight: "fit-content" }}
    >
      <CardHeader className="bg-black dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 flex-shrink-0 border dark:border-gray-700">
        <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
          {t("dashboard.charts.applicationStatus")}
        </Typography>
      </CardHeader>
      <CardBody className="dark:bg-gray-800 px-2 sm:px-4 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6 flex items-center justify-center overflow-visible">
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
  );
}

