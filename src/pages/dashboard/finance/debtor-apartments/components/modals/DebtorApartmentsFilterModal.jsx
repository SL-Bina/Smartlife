import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtorApartmentsFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
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
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <MagnifyingGlassIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("debtorApartments.filter.title") || "Axtarış"}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-600" onClick={onClose}>
          <XMarkIcon className="text-gray-700 dark:text-gray-300 h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        {/* Borc Məbləği */}
        <div>
          <Typography variant="small" color="blue-gray" className="mb-3 font-semibold dark:text-gray-300">
            {t("debtorApartments.filter.debtAmount") || "Borc Məbləği"}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.debtAmountMin || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                  onFilterChange("debtAmountMin", value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              type="number"
              min="0"
              placeholder="Max"
              value={filters.debtAmountMax || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                  onFilterChange("debtAmountMax", value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </div>

        {/* Bina */}
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("debtorApartments.filter.building") || "Bina"}
          </Typography>
          <select
            value={filters.building || ""}
            onChange={(e) => {
              onFilterChange("building", e.target.value);
              onFilterChange("block", "");
              onFilterChange("apartment", "");
            }}
            disabled={loadingBuildings}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              {loadingBuildings ? t("debtorApartments.filter.loading") || "Yüklənir..." : t("debtorApartments.filter.selectWithDots") || "Seçin..."}
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
            {t("debtorApartments.filter.block") || "Blok"}
          </Typography>
          <select
            value={filters.block || ""}
            onChange={(e) => {
              onFilterChange("block", e.target.value);
              onFilterChange("apartment", "");
            }}
            disabled={!filters.building}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              {!filters.building
                ? t("debtorApartments.filter.selectBuildingFirst") || "Əvvəlcə bina seçin"
                : t("debtorApartments.filter.selectWithDots") || "Seçin..."}
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
            {t("debtorApartments.filter.apartment") || "Mənzil"}
          </Typography>
          <select
            value={filters.apartment || ""}
            onChange={(e) => onFilterChange("apartment", e.target.value)}
            disabled={!filters.block}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              {!filters.block
                ? t("debtorApartments.filter.selectBlockFirst") || "Əvvəlcə blok seçin"
                : t("debtorApartments.filter.selectWithDots") || "Seçin..."}
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
          <Typography variant="small" color="blue-gray" className="mb-3 font-semibold dark:text-gray-300">
            {t("debtorApartments.filter.floor") || "Mərtəbə"}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.floorMin || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseInt(value) >= 0 && !isNaN(parseInt(value)))) {
                  onFilterChange("floorMin", value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              type="number"
              min="0"
              placeholder="Max"
              value={filters.floorMax || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseInt(value) >= 0 && !isNaN(parseInt(value)))) {
                  onFilterChange("floorMax", value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </div>

        {/* Kvadrat metr */}
        <div>
          <Typography variant="small" color="blue-gray" className="mb-3 font-semibold dark:text-gray-300">
            {t("debtorApartments.filter.area") || "Kvadrat metr"}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Min"
              value={filters.areaMin || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                  onFilterChange("areaMin", value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Max"
              value={filters.areaMax || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
                  onFilterChange("areaMax", value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </div>

        {/* Otaq sayı */}
        <div>
          <Typography variant="small" color="blue-gray" className="mb-3 font-semibold dark:text-gray-300">
            {t("debtorApartments.filter.rooms") || "Otaq sayı"}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.roomsMin || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseInt(value) >= 0 && !isNaN(parseInt(value)))) {
                  onFilterChange("roomsMin", value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              type="number"
              min="0"
              placeholder="Max"
              value={filters.roomsMax || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseInt(value) >= 0 && !isNaN(parseInt(value)))) {
                  onFilterChange("roomsMax", value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </div>

        {/* Faktura sayı */}
        <div>
          <Typography variant="small" color="blue-gray" className="mb-3 font-semibold dark:text-gray-300">
            {t("debtorApartments.filter.invoiceCount") || "Faktura sayı"}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.invoiceCountMin || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseInt(value) >= 0 && !isNaN(parseInt(value)))) {
                  onFilterChange("invoiceCountMin", value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              type="number"
              min="0"
              placeholder="Max"
              value={filters.invoiceCountMax || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (parseInt(value) >= 0 && !isNaN(parseInt(value)))) {
                  onFilterChange("invoiceCountMax", value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between gap-3 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button variant="text" color="blue-gray" onClick={onClear} className="dark:text-gray-300 dark:hover:bg-gray-700 px-6">
          {t("buttons.clear") || "Təmizlə"}
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onClose}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 px-6"
          >
            {t("buttons.cancel") || "Ləğv et"}
          </Button>
          <Button color="blue" onClick={onApply} className="dark:bg-blue-600 dark:hover:bg-blue-700 px-8 shadow-lg hover:shadow-xl transition-all">
            {t("buttons.apply") || "Tətbiq et"}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
