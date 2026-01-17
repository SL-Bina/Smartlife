import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function KPIFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("kpi.searchModal.title")}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("kpi.searchModal.employeeName")}
          </Typography>
          <Input
            placeholder={t("kpi.searchModal.enterEmployeeName")}
            value={filters.employeeName || ""}
            onChange={(e) => onFilterChange("employeeName", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("kpi.searchModal.employeeSurname")}
          </Typography>
          <Input
            placeholder={t("kpi.searchModal.enterEmployeeSurname")}
            value={filters.employeeSurname || ""}
            onChange={(e) => onFilterChange("employeeSurname", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("kpi.searchModal.department")}
          </Typography>
          <Input
            placeholder={t("kpi.searchModal.enterDepartment")}
            value={filters.department || ""}
            onChange={(e) => onFilterChange("department", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("kpi.searchModal.dateRange") || "Tarix aralığı"}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                {t("kpi.searchModal.dateFrom")}
              </Typography>
              <Input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => onFilterChange("dateFrom", e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                {t("kpi.searchModal.dateTo")}
              </Typography>
              <Input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => onFilterChange("dateTo", e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button variant="outlined" color="blue-gray" onClick={onClear} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
          {t("buttons.clear")}
        </Button>
        <div className="flex gap-2">
          <Button variant="outlined" color="blue-gray" onClick={onClose} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
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

