import React from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ApartmentInfoCard({ apartment }) {
  const { t } = useTranslation();

  if (!apartment) return null;

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 p-6 border-b border-red-600 dark:border-gray-700 dark:bg-gray-800"
      >
        <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
          {t("serviceFee.apartmentInfo")}
        </Typography>
      </CardHeader>
      <CardBody className="px-6 py-6 dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
              {t("serviceFee.labels.apartment")}
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
              {apartment.number}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
              {t("serviceFee.labels.block")}
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
              {apartment.block}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
              {t("serviceFee.labels.floor")}
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
              {apartment.floor}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
              {t("serviceFee.labels.area")}
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
              {apartment.area} m²
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
              {t("serviceFee.labels.resident")}
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
              {apartment.resident}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
              {t("serviceFee.labels.complex")}
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
              {apartment.complex}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
              {t("serviceFee.labels.building")}
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
              {apartment.building}
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

