import React from "react";
import { Card, CardHeader, CardBody, Typography, Chip } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function FeeHistoryCard({ feeHistory }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 p-6 border-b border-red-600 dark:border-gray-700 dark:bg-gray-800"
      >
        <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
          {t("serviceFee.changeHistory")}
        </Typography>
      </CardHeader>
      <CardBody className="px-6 py-6 dark:bg-gray-800">
        {feeHistory.length === 0 ? (
          <Typography variant="small" color="blue-gray" className="text-center py-4 dark:text-gray-400">
            {t("serviceFee.noHistory")}
          </Typography>
        ) : (
          <div className="space-y-4">
            {feeHistory.map((item, index) => (
              <div
                key={item.id}
                className={`pb-4 ${
                  index !== feeHistory.length - 1 ? "border-b border-red-600 dark:border-gray-700" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="small" className="font-semibold text-blue-gray-700 dark:text-blue-300">
                    {item.amount} AZN
                  </Typography>
                  <Chip
                    value={index === 0 ? t("serviceFee.current") : t("serviceFee.old")}
                    size="sm"
                    color={index === 0 ? "green" : "gray"}
                    variant="ghost"
                    className="dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {new Date(item.date).toLocaleDateString("az-AZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
                <Typography variant="small" className="text-blue-gray-400 dark:text-gray-400">
                  {item.reason}
                </Typography>
                <Typography variant="small" className="text-blue-gray-400 dark:text-gray-500 text-xs mt-1">
                  {t("serviceFee.changedBy")}: {item.changedBy}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

