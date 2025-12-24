import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ExpensesSummaryCard({ totalExpenses }) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex justify-end">
      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardBody className="p-4">
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.summary.totalExpenses")}
          </Typography>
          <Typography variant="h5" color="red" className="font-bold dark:text-red-300">
            {totalExpenses} ₼
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

