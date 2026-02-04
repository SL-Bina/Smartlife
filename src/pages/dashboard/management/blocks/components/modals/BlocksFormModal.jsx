import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function BlocksFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false, saving = false }) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
          {title}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>

      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("blocks.form.name") || "Blok adı"}
          </Typography>
          <Input
            placeholder={t("blocks.form.enterName") || "Məs: Block-a1"}
            value={formData.name || ""}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("blocks.form.complexId") || "Complex ID"}
            </Typography>
            <Input
              type="number"
              placeholder={t("blocks.form.enterComplexId") || "Məs: 5"}
              value={formData.complex_id || ""}
              onChange={(e) => onFieldChange("complex_id", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("blocks.form.buildingId") || "Building ID"}
            </Typography>
            <Input
              type="number"
              placeholder={t("blocks.form.enterBuildingId") || "Məs: 2"}
              value={formData.building_id || ""}
              onChange={(e) => onFieldChange("building_id", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("blocks.form.totalFloor") || "Mərtəbə sayı"}
            </Typography>
            <Input
              type="number"
              placeholder={t("blocks.form.enterTotalFloor") || "Məs: 16"}
              value={formData.meta?.total_floor || ""}
              onChange={(e) => onFieldChange("meta.total_floor", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("blocks.form.totalApartment") || "Mənzil sayı"}
            </Typography>
            <Input
              type="number"
              placeholder={t("blocks.form.enterTotalApartment") || "Məs: 280"}
              value={formData.meta?.total_apartment || ""}
              onChange={(e) => onFieldChange("meta.total_apartment", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button variant="outlined" color="blue-gray" onClick={onClose} disabled={saving} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
          {t("buttons.cancel") || "Ləğv et"}
        </Button>
        <Button color={isEdit ? "blue" : "green"} onClick={onSave} loading={saving} disabled={saving}
          className={isEdit ? "dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:bg-green-600 dark:hover:bg-green-700"}>
          {isEdit ? (t("buttons.save") || "Yadda saxla") : (t("buttons.add") || "Əlavə et")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
