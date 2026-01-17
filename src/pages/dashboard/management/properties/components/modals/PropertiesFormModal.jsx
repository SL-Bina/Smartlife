import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function PropertiesFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false }) {
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
            {isEdit ? t("properties.edit.apartment") : t("properties.create.apartment")}
          </Typography>
          <Input
            placeholder={isEdit ? t("properties.edit.enterApartment") : t("properties.create.enterApartment")}
            value={formData.number || ""}
            onChange={(e) => onFieldChange("number", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {isEdit ? t("properties.edit.block") : t("properties.create.block")}
          </Typography>
          <Input
            placeholder={isEdit ? t("properties.edit.enterBlock") : t("properties.create.enterBlock")}
            value={formData.block || ""}
            onChange={(e) => onFieldChange("block", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {isEdit ? t("properties.edit.floor") : t("properties.create.floor")}
            </Typography>
            <Input
              type="number"
              placeholder={isEdit ? t("properties.edit.enterFloor") : t("properties.create.enterFloor")}
              value={formData.floor || ""}
              onChange={(e) => onFieldChange("floor", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {isEdit ? t("properties.edit.area") : t("properties.create.area")}
            </Typography>
            <Input
              type="number"
              placeholder={isEdit ? t("properties.edit.enterArea") : t("properties.create.enterArea")}
              value={formData.area || ""}
              onChange={(e) => onFieldChange("area", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {isEdit ? t("properties.edit.resident") : t("properties.create.resident")}
          </Typography>
          <Input
            placeholder={isEdit ? t("properties.edit.enterResident") : t("properties.create.enterResident")}
            value={formData.resident || ""}
            onChange={(e) => onFieldChange("resident", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {isEdit ? t("properties.edit.cancel") : t("properties.create.cancel")}
        </Button>
        <Button
          color={isEdit ? "blue" : "green"}
          onClick={onSave}
          className={isEdit ? "dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:bg-green-600 dark:hover:bg-green-700"}
        >
          {isEdit ? t("properties.edit.save") : t("properties.create.save")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

