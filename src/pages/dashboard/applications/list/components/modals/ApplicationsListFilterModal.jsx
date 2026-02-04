import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography, Select, Option } from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ApplicationsListFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("applications.list.searchModal.title") || "Axtarış"}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.searchModal.search") || "Axtarış"}
          </Typography>
          <Input
            placeholder={t("applications.list.searchModal.searchByApplicationName") || "Müraciət adına görə axtar"}
            value={filters.searchText || ""}
            onChange={(e) => onFilterChange("searchText", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.searchModal.dateRange") || "Tarix aralığı"}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                {t("applications.list.searchModal.start") || "Başlanğıc"}
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
                {t("applications.list.searchModal.end") || "Son"}
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
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.searchModal.plannedDateRange") || "Planlanmış tarix aralığı"}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                {t("applications.list.searchModal.start") || "Başlanğıc"}
              </Typography>
              <Input
                type="date"
                value={filters.plannedDateFrom || ""}
                onChange={(e) => onFilterChange("plannedDateFrom", e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                {t("applications.list.searchModal.end") || "Son"}
              </Typography>
              <Input
                type="date"
                value={filters.plannedDateTo || ""}
                onChange={(e) => onFilterChange("plannedDateTo", e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
          </div>
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.searchModal.department") || "Şöbə"}
          </Typography>
          <Select
            label={t("applications.list.searchModal.allDepartments") || "Bütün şöbələr"}
            value={filters.department || ""}
            onChange={(val) => onFilterChange("department", val)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400 !text-left" }}
            containerProps={{ className: "!min-w-0" }}
          >
            <Option value="" className="dark:text-gray-300">
              {t("applications.list.searchModal.allDepartments") || "Bütün şöbələr"}
            </Option>
            <Option value="Təmizlik" className="dark:text-gray-300">
              {t("applications.list.categoryModal.cleaning") || "Təmizlik"}
            </Option>
            <Option value="Santexnika" className="dark:text-gray-300">
              {t("applications.list.categoryModal.plumbing") || "Santexnika"}
            </Option>
            <Option value="Elektrik" className="dark:text-gray-300">
              {t("applications.list.categoryModal.electricity") || "Elektrik"}
            </Option>
            <Option value="Təmir" className="dark:text-gray-300">
              {t("applications.list.categoryModal.repair") || "Təmir"}
            </Option>
          </Select>
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.searchModal.employeePriority") || "Əməkdaş prioriteti"}
          </Typography>
          <Select
            label={t("applications.list.searchModal.allPriorities") || "Bütün prioritetlər"}
            value={filters.employeePriority || ""}
            onChange={(val) => onFilterChange("employeePriority", val)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400 !text-left" }}
            containerProps={{ className: "!min-w-0" }}
          >
            <Option value="" className="dark:text-gray-300">
              {t("applications.list.searchModal.allPriorities") || "Bütün prioritetlər"}
            </Option>
            <Option value="Aşağı" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.priorityLow") || "Aşağı"}
            </Option>
            <Option value="Normal" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.priorityNormal") || "Normal"}
            </Option>
            <Option value="Orta" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.priorityMedium") || "Orta"}
            </Option>
            <Option value="Yüksək" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.priorityHigh") || "Yüksək"}
            </Option>
            <Option value="Tecili" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.priorityUrgent") || "Tecili"}
            </Option>
            <Option value="5 deqiqelik" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.priority5Minute") || "5 deqiqelik"}
            </Option>
          </Select>
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.searchModal.residentPriority") || "Sakin prioriteti"}
          </Typography>
          <Select
            label={t("applications.list.searchModal.allPriorities") || "Bütün prioritetlər"}
            value={filters.residentPriority || ""}
            onChange={(val) => onFilterChange("residentPriority", val)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400 !text-left" }}
            containerProps={{ className: "!min-w-0" }}
          >
            <Option value="" className="dark:text-gray-300">
              {t("applications.list.searchModal.allPriorities") || "Bütün prioritetlər"}
            </Option>
            <Option value="Aşağı" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.priorityLow") || "Aşağı"}
            </Option>
            <Option value="Normal" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.priorityNormal") || "Normal"}
            </Option>
            <Option value="Orta" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.priorityMedium") || "Orta"}
            </Option>
            <Option value="Yüksək" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.priorityHigh") || "Yüksək"}
            </Option>
          </Select>
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.searchModal.status") || "Status"}
          </Typography>
          <Select
            label={t("applications.list.searchModal.allStatuses") || "Bütün statuslar"}
            value={filters.status || ""}
            onChange={(val) => onFilterChange("status", val)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400 !text-left" }}
            containerProps={{ className: "!min-w-0" }}
          >
            <Option value="" className="dark:text-gray-300">
              {t("applications.list.searchModal.allStatuses") || "Bütün statuslar"}
            </Option>
            <Option value="Gözləmədə" className="dark:text-gray-300">
              {t("applicationStatus.pending") || "Gözləmədə"}
            </Option>
            <Option value="Tamamlandı" className="dark:text-gray-300">
              {t("applicationStatus.completed") || "Tamamlandı"}
            </Option>
            <Option value="Ləğv edildi" className="dark:text-gray-300">
              {t("applicationStatus.cancelled") || "Ləğv edildi"}
            </Option>
            <Option value="İcra olunur" className="dark:text-gray-300">
              {t("applicationStatus.inProgress") || "İcra olunur"}
            </Option>
          </Select>
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

