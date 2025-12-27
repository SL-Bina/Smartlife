import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ApartmentGroupsFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-900" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("buttons.filter")}</DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("apartmentGroups.filters.complex")}
          </Typography>
          <Input
            label={t("common.enter")}
            value={filters.complex}
            onChange={(e) => onFilterChange("complex", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("apartmentGroups.filters.building")}
          </Typography>
          <Input
            label={t("common.enter")}
            value={filters.building}
            onChange={(e) => onFilterChange("building", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 dark:border-gray-700">
        <Button variant="text" color="blue-gray" onClick={onClear} className="dark:text-gray-300 dark:hover:bg-gray-700">
          {t("buttons.clear")}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onClose}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("buttons.cancel")}
          </Button>
          <Button color="blue" onClick={onApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("buttons.filter")}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}

