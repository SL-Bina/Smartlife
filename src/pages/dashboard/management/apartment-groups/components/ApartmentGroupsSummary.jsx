import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ApartmentGroupsSummary({ totalGroups, totalApartments, occupied }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
      <CardBody className="space-y-2 dark:bg-gray-800">
        <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
          {t("apartmentGroups.summary.title")}
        </Typography>
        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
          {t("apartmentGroups.summary.totalGroups", { count: totalGroups })}
        </Typography>
        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
          {t("apartmentGroups.summary.totalApartments", { count: totalApartments })}
        </Typography>
        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
          {t("apartmentGroups.summary.occupied", { count: occupied })}
        </Typography>
      </CardBody>
    </Card>
  );
}

