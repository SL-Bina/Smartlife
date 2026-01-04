import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography, IconButton } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function InvoicesFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <Typography variant="h5" className="font-bold">
          {t("invoices.filter.title") || "Axtarış"}
        </Typography>
        {/* <IconButton variant="text" size="sm"  className="dark:text-white "> */}
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer " />
        </div>
        {/* </IconButton> */}
      </DialogHeader>

      <DialogBody divider className="space-y-6 dark:bg-gray-800 dark:border-gray-700 max-h-[70vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Xidmət adı */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("invoices.filter.serviceName") || "Xidmət adı"}
            </Typography>
            <select
              value={filters.serviceName || ""}
              onChange={(e) => onFilterChange("serviceName", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="" disabled className="">{t("invoices.filter.select") || "Seçin"}</option>
            </select>
          </div>

          {/* Tarix aralığı */}
          <div className="md:col-span-2">
            <Typography variant="small" color="blue-gray" className="mb-3 font-semibold dark:text-gray-300">
              {t("invoices.filter.dateRange") || "Tarix aralığı"}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("invoices.filter.startDate") || "Başlanğıc tarixi"}
                </Typography>
                <Input
                  type="date"
                  value={filters.dateStart || ""}
                  onChange={(e) => onFilterChange("dateStart", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("invoices.filter.endDate") || "Bitmə tarixi"}
                </Typography>
                <Input
                  type="date"
                  value={filters.dateEnd || ""}
                  onChange={(e) => onFilterChange("dateEnd", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
            </div>
          </div>

          {/* Ödəniş tarixi aralığı */}
          <div className="md:col-span-2">
            <Typography variant="small" color="blue-gray" className="mb-3 font-semibold dark:text-gray-300">
              {t("invoices.filter.paymentDateRange") || "Ödəniş tarixi aralığı"}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("invoices.filter.startDate") || "Başlanğıc tarixi"}
                </Typography>
                <Input
                  type="date"
                  value={filters.paymentDateStart || ""}
                  onChange={(e) => onFilterChange("paymentDateStart", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("invoices.filter.endDate") || "Bitmə tarixi"}
                </Typography>
                <Input
                  type="date"
                  value={filters.paymentDateEnd || ""}
                  onChange={(e) => onFilterChange("paymentDateEnd", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
            </div>
          </div>

          {/* Bina, Blok, Mənzil, Mərtəbə, Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Bina */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("invoices.filter.building") || "Bina"}
              </Typography>
              <select
                value={filters.building || ""}
                onChange={(e) => onFilterChange("building", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="" disabled className="">{t("invoices.filter.selectWithDots") || "Seçin..."}</option>
              </select>
            </div>

            {/* Blok */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("invoices.filter.block") || "Blok"}
              </Typography>
              <select
                value={filters.block || ""}
                onChange={(e) => onFilterChange("block", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="" disabled className="">{t("invoices.filter.selectWithDots") || "Seçin..."}</option>
              </select>
            </div>

            {/* Mənzil */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("invoices.filter.apartment") || "Mənzil"}
              </Typography>
              <select
                value={filters.apartment || ""}
                onChange={(e) => onFilterChange("apartment", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="" disabled className="">{t("invoices.filter.selectWithDots") || "Seçin..."}</option>
              </select>
            </div>

            {/* Mərtəbə */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("invoices.filter.floor") || "Mərtəbə"}
              </Typography>
              <Input
                type="number"
                min="0"
                value={filters.floor || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || (parseInt(value) >= 0 && !isNaN(parseInt(value)))) {
                    onFilterChange("floor", value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
                label={t("invoices.filter.floor") || "Mərtəbə"}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>

            {/* Status */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("invoices.filter.status") || "Status"}
              </Typography>
              <select
                value={filters.status || ""}
                onChange={(e) => onFilterChange("status", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="" className="">{t("invoices.filter.all") || "Hamısı"}</option>
                <option value="Ödənilib" className="">{t("invoices.filter.paid") || "Ödənilib"}</option>
                <option value="Ödənilməmiş" className="">{t("invoices.filter.unpaid") || "Ödənilməmiş"}</option>
              </select>
            </div>
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 dark:border-gray-700">
        <Button variant="text" color="blue-gray" onClick={onClear} className="dark:text-gray-300 dark:hover:bg-gray-700">
          {t("buttons.clear") || "Təmizlə"}
        </Button>
        <div className="flex gap-2">
          <Button variant="outlined" color="blue-gray" onClick={onClose} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel") || "Ləğv et"}
          </Button>
          <Button color="blue" onClick={onApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("buttons.search") || "Axtar"}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
