import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function InvoicesSummaryCard({ totalPaid, totalConsumption }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardBody className="p-4">
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("invoices.summary.paid")}
          </Typography>
          <Typography variant="h5" color="green" className="font-bold dark:text-green-300">
            {totalPaid} ₼
          </Typography>
        </CardBody>
      </Card>
      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardBody className="p-4">
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("invoices.summary.consumption")}
          </Typography>
          <Typography variant="h5" color="blue-gray" className="font-bold dark:text-white">
            {totalConsumption} ₼
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

