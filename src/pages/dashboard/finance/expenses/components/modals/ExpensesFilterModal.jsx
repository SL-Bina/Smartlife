import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ExpensesFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white">{t("expenses.filter.title")}</DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.filter.category")}
          </Typography>
          <Input
            label={t("expenses.filter.enter")}
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.filter.paymentMethod")}
          </Typography>
          <Input
            label={t("expenses.filter.enter")}
            value={filters.paymentMethod}
            onChange={(e) => onFilterChange("paymentMethod", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.filter.status")}
          </Typography>
          <Input
            label={t("expenses.filter.enter")}
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800">
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
            {t("buttons.apply")}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}

