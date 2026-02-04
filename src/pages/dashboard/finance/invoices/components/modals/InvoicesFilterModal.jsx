import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography, IconButton } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { buildingsAPI } from "@/pages/dashboard/management/buildings/api";

export function InvoicesFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { t } = useTranslation();
  const [buildings, setBuildings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchBuildings = async () => {
        try {
          setLoadingBuildings(true);
          const response = await buildingsAPI.getAll({ page: 1, per_page: 1000 });
          if (response.success && response.data) {
            setBuildings(response.data.data || []);
          }
        } catch (error) {
          console.error("Error fetching buildings:", error);
        } finally {
          setLoadingBuildings(false);
        }
      };
      fetchBuildings();
    }
  }, [open]);

  useEffect(() => {
    if (open && filters.building) {
      // TODO: Fetch blocks when building is selected
      // For now, using mock data
      setBlocks([
        { id: 1, name: "Blok A" },
        { id: 2, name: "Blok B" },
        { id: 3, name: "Blok C" },
      ]);
    } else {
      setBlocks([]);
      setApartments([]);
    }
  }, [open, filters.building]);

  useEffect(() => {
    if (open && filters.block) {
      // TODO: Fetch apartments when block is selected
      // For now, using mock data
      setApartments([
        { id: 1, name: "Mənzil 1" },
        { id: 2, name: "Mənzil 2" },
        { id: 3, name: "Mənzil 3" },
      ]);
    } else {
      setApartments([]);
    }
  }, [open, filters.block]);

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <Typography variant="h5" className="font-bold">
          {t("invoices.filter.title") || "Axtarış"}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer " />
        </div>
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
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
            >
              <option value="" disabled>{t("invoices.filter.select") || "Seçin"}</option>
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
                onChange={(e) => {
                  onFilterChange("building", e.target.value);
                  // Reset block and apartment when building changes
                  onFilterChange("block", "");
                  onFilterChange("apartment", "");
                }}
                disabled={loadingBuildings}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {loadingBuildings ? t("invoices.filter.loading") || "Yüklənir..." : t("invoices.filter.selectWithDots") || "Seçin..."}
                </option>
                {buildings.map((building) => (
                  <option key={building.id} value={String(building.id)}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Blok */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("invoices.filter.block") || "Blok"}
              </Typography>
              <select
                value={filters.block || ""}
                onChange={(e) => {
                  onFilterChange("block", e.target.value);
                  // Reset apartment when block changes
                  onFilterChange("apartment", "");
                }}
                disabled={!filters.building}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {!filters.building
                    ? t("invoices.filter.selectBuildingFirst") || "Əvvəlcə bina seçin"
                    : t("invoices.filter.selectWithDots") || "Seçin..."}
                </option>
                {blocks.map((block) => (
                  <option key={block.id} value={String(block.id)}>
                    {block.name}
                  </option>
                ))}
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
                disabled={!filters.block}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {!filters.block
                    ? t("invoices.filter.selectBlockFirst") || "Əvvəlcə blok seçin"
                    : t("invoices.filter.selectWithDots") || "Seçin..."}
                </option>
                {apartments.map((apartment) => (
                  <option key={apartment.id} value={String(apartment.id)}>
                    {apartment.name}
                  </option>
                ))}
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
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
              >
                <option value="">{t("invoices.filter.all") || "Hamısı"}</option>
                <option value="Ödənilib">{t("invoices.filter.paid") || "Ödənilib"}</option>
                <option value="Ödənilməmiş">{t("invoices.filter.unpaid") || "Ödənilməmiş"}</option>
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
