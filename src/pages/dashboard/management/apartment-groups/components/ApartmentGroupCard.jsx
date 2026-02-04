import React from "react";
import { Card, CardHeader, CardBody, Typography, Chip, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ApartmentGroupCard({ group, onEdit }) {
  const { t } = useTranslation();
  const free = group.total - group.occupied;
  const ratio = Math.round((group.occupied / group.total) * 100);

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-sm flex flex-col justify-between dark:bg-gray-800">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="p-4 pb-2 flex items-start justify-between dark:bg-gray-800"
      >
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="text-[11px] font-medium uppercase dark:text-gray-400"
          >
            {t("apartmentGroups.labels.groupName")}
          </Typography>
          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
            {group.name}
          </Typography>
        </div>
        <Chip
          size="sm"
          color={ratio > 80 ? "green" : ratio > 50 ? "amber" : "blue-gray"}
          value={t("apartmentGroups.labels.occupancy", { ratio })}
          className="dark:bg-opacity-80"
        />
      </CardHeader>
      <CardBody className="p-4 pt-0 space-y-2 dark:bg-gray-800">
        <div className="space-y-1">
          <Typography
            variant="small"
            color="blue-gray"
            className="text-[11px] font-medium uppercase dark:text-gray-400"
          >
            {t("apartmentGroups.labels.complex")}
          </Typography>
          <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
            {group.complex}
          </Typography>
        </div>
        <div className="space-y-1">
          <Typography
            variant="small"
            color="blue-gray"
            className="text-[11px] font-medium uppercase dark:text-gray-400"
          >
            {t("apartmentGroups.labels.building")}
          </Typography>
          <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
            {group.building}
          </Typography>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="space-y-1">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-[11px] font-medium uppercase dark:text-gray-400"
            >
              {t("apartmentGroups.labels.total")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {group.total}
            </Typography>
          </div>
          <div className="space-y-1">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-[11px] font-medium uppercase dark:text-gray-400"
            >
              {t("apartmentGroups.labels.occupied")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {group.occupied}
            </Typography>
          </div>
          <div className="space-y-1">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-[11px] font-medium uppercase dark:text-gray-400"
            >
              {t("apartmentGroups.labels.free")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {free}
            </Typography>
          </div>
        </div>
        <div className="space-y-1 pt-2">
          <Typography
            variant="small"
            color="blue-gray"
            className="text-[11px] font-medium uppercase dark:text-gray-400"
          >
            {t("apartmentGroups.labels.serviceFee")}
          </Typography>
          <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
            {t("apartmentGroups.labels.serviceFeeValue", { value: group.serviceFee })}
          </Typography>
        </div>
        <div className="flex justify-end pt-4">
          <Button
            variant="outlined"
            size="sm"
            color="blue-gray"
            onClick={() => onEdit(group)}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("buttons.edit")}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

