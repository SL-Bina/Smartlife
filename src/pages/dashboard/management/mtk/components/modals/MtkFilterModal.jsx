import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AppSelect from "@/components/ui/AppSelect";

const statusOptions = [
  { id: "active", name: "Aktiv" },
  { id: "inactive", name: "Qeyri-aktiv" },
];

export function MtkFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  if (!open) return null;

  const hasActiveFilters = 
    (filters.status && filters.status !== "") ||
    (filters.address && filters.address.trim() !== "") ||
    (filters.email && filters.email.trim() !== "") ||
    (filters.phone && filters.phone.trim() !== "") ||
    (filters.website && filters.website.trim() !== "") ||
    (filters.color && filters.color.trim() !== "");

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
          <FunnelIcon className="h-5 w-5 text-blue-500" />
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

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              Web sayt
            </Typography>
            <Input
              type="url"
              placeholder="Web sayt yaz..."
              value={filters.website || ""}
              onChange={(e) => onFilterChange("website", e.target.value)}
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
        <Button color="blue" onClick={onApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
          Tətbiq et
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
