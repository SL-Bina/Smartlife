import React from "react";
import { Card, CardBody, Typography, Button, Select, Option } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ApartmentGroupsActions({ onFilterClick, onCreateClick, onClear, filters, onFilterChange }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-sm md:col-span-2 dark:bg-gray-800">
      <CardBody className="flex flex-wrap gap-4 items-end dark:bg-gray-800">
        <div className="w-full">
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-1 text-[11px] font-medium uppercase dark:text-gray-400"
          >
            {t("apartmentGroups.filters.complex")}
          </Typography>
          <Select
            label={t("common.enter")}
            value={filters.complex}
            onChange={(val) => onFilterChange("complex", val || "")}
            className="dark:text-white"
          >
            <Option>Kompleks 1</Option>
            <Option>Kompleks 2</Option>
          </Select>
        </div>
        <div className="w-full">
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-1 text-[11px] font-medium uppercase dark:text-gray-400"
          >
            {t("apartmentGroups.filters.building")}
          </Typography>
          <Select
            label={t("common.enter")}
            value={filters.building}
            onChange={(val) => onFilterChange("building", val || "")}
            className="dark:text-white"
          >
            <Option>Bina 1</Option>
            <Option>Bina 2</Option>
          </Select>
        </div>
        <div className="w-full flex gap-2 justify-end">
          <Button
            variant="outlined"
            color="blue-gray"
            size="sm"
            onClick={onClear}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("buttons.clear")}
          </Button>
          <Button
            color="blue"
            size="sm"
            onClick={onFilterClick}
            className="dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {t("buttons.filter")}
          </Button>
          <Button color="green" size="sm" onClick={onCreateClick} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("buttons.save")}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

