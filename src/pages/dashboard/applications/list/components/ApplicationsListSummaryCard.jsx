import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ApplicationsListSummaryCard({ totalApplications }) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex justify-end">
      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardBody className="p-4">
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("applications.list.summary.totalApplications") || "Ümumi müraciətlər"}
          </Typography>
          <Typography variant="h5" color="blue" className="font-bold dark:text-blue-300">
            {totalApplications}
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

