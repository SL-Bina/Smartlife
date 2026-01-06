import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography, Select, Option } from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ExpensesFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { t } = useTranslation();

  if (!open) return null;

  // Mock expense categories - real API hazır olduqda dəyişdiriləcək
  const expenseCategories = [
    "Bina xərcləri",
    "Ofis xərcləri",
    "Təmizlik",
    "Santexnika",
    "Elektrik",
    "Təmir",
    "Digər",
  ];

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("expenses.filter.title") || "Axtarış"}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        {/* Xərc növü */}
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("expenses.filter.category") || "Xərc növü"}
          </Typography>
          <Select
            value={filters.category || ""}
            onChange={(val) => onFilterChange("category", val)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          >
            <Option value="" disabled>
              {t("expenses.filter.selectCategory") || "Xərc növü seçin"}
            </Option>
            {expenseCategories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </div>

        {/* Başlıq */}
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("expenses.filter.titleField") || "Başlıq"}
          </Typography>
          <Input
            placeholder={t("expenses.filter.title") || "Başlıq"}
            value={filters.title || ""}
            onChange={(e) => onFilterChange("title", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>

        {/* Məbləğ */}
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("expenses.filter.amount") || "Məbləğ"}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                {t("common.min") || "Min"}
              </Typography>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={filters.amountMin || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                    onFilterChange("amountMin", value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                {t("common.max") || "Max"}
              </Typography>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={filters.amountMax || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                    onFilterChange("amountMax", value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
          </div>
        </div>

        {/* Tarix aralığı */}
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("expenses.filter.dateRange") || "Tarix aralığı"}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                {t("expenses.filter.startDate") || "Başlanğıc tarixi"}
              </Typography>
              <Input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => onFilterChange("startDate", e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                {t("expenses.filter.endDate") || "Bitmə tarixi"}
              </Typography>
              <Input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => onFilterChange("endDate", e.target.value)}
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
          {t("buttons.clear") || "Təmizlə"}
        </Button>
        <Button color="blue" onClick={onApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
          {t("buttons.search") || "Axtar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

