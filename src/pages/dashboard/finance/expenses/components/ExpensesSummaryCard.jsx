import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ExpensesSummaryCard({ bankTotal, cashTotal, totalExpenses }) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Bank Card */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center transform translate-x-6 -translate-y-6">
          <Typography variant="h6" className="text-white font-bold">
            M
          </Typography>
        </div>
        <CardBody className="p-4">
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.summary.bank") || "Bank"}
          </Typography>
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {bankTotal?.toFixed(2) || "0.00"} ₼
          </Typography>
        </CardBody>
      </Card>

      {/* Cash Card */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center transform translate-x-6 -translate-y-6">
          <Typography variant="h6" className="text-white font-bold">
            M
          </Typography>
        </div>
        <CardBody className="p-4">
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.summary.cash") || "Nağd"}
          </Typography>
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {cashTotal?.toFixed(2) || "0.00"} ₼
          </Typography>
        </CardBody>
      </Card>

      {/* Total Card */}
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center transform translate-x-6 -translate-y-6">
          <Typography variant="h6" className="text-white font-bold">
            M
          </Typography>
        </div>
        <CardBody className="p-4">
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.summary.total") || "Ümumi"}
          </Typography>
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {totalExpenses?.toFixed(2) || "0.00"} ₼
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

