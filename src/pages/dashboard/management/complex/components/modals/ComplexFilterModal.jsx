import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function ComplexFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("complexes.filter.title")}
          </Typography>
        </div>
        <div
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("complexes.filter.name")}
            </Typography>
            <Input
              placeholder={t("complexes.filter.enterName")}
              value={filters.name || ""}
              onChange={(e) => onFilterChange("name", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("complexes.filter.address") || "Ünvan"}
            </Typography>
            <Input
              placeholder={t("complexes.filter.enterAddress") || "Ünvan daxil edin"}
              value={filters.address || ""}
              onChange={(e) => onFilterChange("address", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("complexes.filter.status") || "Status"}
            </Typography>
            <select
              value={filters.status || ""}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="" className="dark:bg-gray-800 dark:text-gray-300">
                {t("complexes.filter.all") || "Hamısı"}
              </option>
              <option value="active" className="dark:bg-gray-800 dark:text-gray-300">
                {t("complexes.filter.active") || "Aktiv"}
              </option>
              <option value="inactive" className="dark:bg-gray-800 dark:text-gray-300">
                {t("complexes.filter.inactive") || "Passiv"}
              </option>
            </select>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("complexes.filter.email") || "Email"}
            </Typography>
            <Input
              placeholder={t("complexes.filter.enterEmail") || "Email daxil edin"}
              value={filters.email || ""}
              onChange={(e) => onFilterChange("email", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
              type="email"
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("complexes.filter.phone") || "Telefon"}
            </Typography>
            <Input
              placeholder={t("complexes.filter.enterPhone") || "Telefon daxil edin"}
              value={filters.phone || ""}
              onChange={(e) => onFilterChange("phone", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
              type="tel"
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClear}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.clear") || "Təmizlə"}
        </Button>
        <Button
          color="blue"
          onClick={onApply}
          className="dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {t("buttons.search") || "Axtar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
