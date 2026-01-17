import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("debt.filter.title") || "Axtarış"}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("debt.filter.creditor")}
          </Typography>
          <Input
            label={t("debt.filter.enter")}
            value={filters.creditor}
            onChange={(e) => onFilterChange("creditor", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("debt.filter.category")}
          </Typography>
          <Input
            label={t("debt.filter.enter")}
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("debt.filter.status")}
          </Typography>
          <Input
            label={t("debt.filter.enter")}
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button variant="outlined" color="blue-gray" onClick={onClear} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
          {t("buttons.clear") || "Təmizlə"}
        </Button>
        <Button color="blue" onClick={onApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
          {t("buttons.search") || "Axtar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

