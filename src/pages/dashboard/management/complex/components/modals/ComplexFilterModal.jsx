import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AppSelect from "@/components/ui/AppSelect";
import { useMtkColor } from "@/store/exports";

const statusOptions = [
  { id: "active", name: "Aktiv" },
  { id: "inactive", name: "Qeyri-aktiv" },
];

export function ComplexFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  const { colorCode, getRgba, defaultColor } = useMtkColor();
  
  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultRed;
  
  if (!open) return null;

  const hasActiveFilters = 
    (filters.status && filters.status !== "") ||
    (filters.address && filters.address.trim() !== "") ||
    (filters.email && filters.email.trim() !== "") ||
    (filters.phone && filters.phone.trim() !== "");

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
      dismiss={{ enabled: false }}
    >
      <DialogHeader 
        className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg transition-colors"
        style={{
          background: colorCode 
            ? `linear-gradient(to right, ${getRgba(0.1)}, ${getRgba(0.05)})` 
            : "linear-gradient(to right, rgba(220, 38, 38, 0.1), rgba(185, 28, 28, 0.05))",
        }}
      >
        <div className="flex items-center gap-3">
          <FunnelIcon 
            className="h-5 w-5" 
            style={{ color: activeColor }}
          />
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            Filter
          </Typography>
        </div>

        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              Status
            </Typography>
            <AppSelect
              items={statusOptions}
              value={filters.status && filters.status !== "" ? filters.status : null}
              onChange={(value) => onFilterChange("status", value === null ? "" : value)}
              placeholder="Status seç"
              allowAll={true}
              allLabel="Hamısı"
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              Ünvan
            </Typography>
            <Input
              placeholder="Ünvan yaz..."
              value={filters.address || ""}
              onChange={(e) => onFilterChange("address", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              Email
            </Typography>
            <Input
              type="email"
              placeholder="Email yaz..."
              value={filters.email || ""}
              onChange={(e) => onFilterChange("email", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              Telefon
            </Typography>
            <Input
              type="tel"
              placeholder="Telefon yaz..."
              value={filters.phone || ""}
              onChange={(e) => onFilterChange("phone", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Təmizlə
        </Button>
        <Button 
          onClick={onApply} 
          className="text-white"
          style={{
            backgroundColor: activeColor,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colorCode 
              ? getRgba(0.9) 
              : "#b91c1c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = activeColor;
          }}
        >
          Tətbiq et
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
