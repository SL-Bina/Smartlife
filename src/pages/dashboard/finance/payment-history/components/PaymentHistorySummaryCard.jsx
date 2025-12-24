import React from "react";
import { Card, CardBody, Chip } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function PaymentHistorySummaryCard({ totalAmount }) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex justify-end">
      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardBody className="p-4">
          <Chip
            value={`${t("paymentHistory.summary.total")}: ${totalAmount} ₼`}
            color="green"
            className="font-semibold dark:bg-opacity-80"
          />
        </CardBody>
      </Card>
    </div>
  );
}

