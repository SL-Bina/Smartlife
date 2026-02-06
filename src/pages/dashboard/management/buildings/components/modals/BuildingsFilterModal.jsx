import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function BuildingsFilterModal({ open, onClose, filters, onFilterChange, onApply, onClear }) {
  if (!open) return null;

  const hasActiveFilters = filters.name && filters.name.trim() !== "";

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            Filter
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
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            Ad
          </Typography>
          <Input
            placeholder="Ad daxil et"
            value={filters.name || ""}
            onChange={(e) => onFilterChange("name", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
            icon={<MagnifyingGlassIcon className="h-4 w-4" />}
          />
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
          Axtar
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
