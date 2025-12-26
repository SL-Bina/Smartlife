import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

export function MtkFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { t } = useTranslation();

  if (!open) return null;

  const hasActiveFilters = filters.name && filters.name.trim() !== "";

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="sm"
      className="dark:bg-gray-900 border border-red-600 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <Typography variant="h5" className="font-bold">
            {t("mtk.filter.title")}
          </Typography>
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700 py-6">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
            {t("mtk.filter.name")}
          </Typography>
          <Input
            label={t("mtk.filter.enterName")}
            value={filters.name || ""}
            onChange={(e) => onFilterChange("name", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            icon={<MagnifyingGlassIcon className="h-4 w-4" />}
          />
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between gap-3 dark:bg-gray-800 dark:border-gray-700 pt-4">
        <Button
          variant="text"
          color="blue-gray"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          {t("mtk.filter.clear")}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onClose}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
          >
            {t("mtk.filter.close")}
          </Button>
          <Button
            color="blue"
            onClick={onApply}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 min-w-[100px]"
          >
            {t("mtk.filter.apply")}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}

