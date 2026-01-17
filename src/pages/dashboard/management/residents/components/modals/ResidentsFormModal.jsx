import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ResidentsFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false }) {
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
            {isEdit ? t("residents.edit.fullName") : t("residents.create.fullName")}
          </Typography>
          <Input
            placeholder={isEdit ? t("residents.edit.enterFullName") : t("residents.create.enterFullName")}
            value={formData.fullName || ""}
            onChange={(e) => onFieldChange("fullName", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {isEdit ? t("residents.edit.phone") : t("residents.create.phone")}
            </Typography>
            <Input
              placeholder={isEdit ? t("residents.edit.enterPhone") : t("residents.create.enterPhone")}
              value={formData.phone || ""}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {isEdit ? t("residents.edit.email") : t("residents.create.email")}
            </Typography>
            <Input
              placeholder={isEdit ? t("residents.edit.enterEmail") : t("residents.create.enterEmail")}
              value={formData.email || ""}
              onChange={(e) => onFieldChange("email", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {isEdit ? t("residents.edit.apartment") : t("residents.create.apartment")}
          </Typography>
          <Input
            placeholder={isEdit ? t("residents.edit.enterApartment") : t("residents.create.enterApartment")}
            value={formData.apartment || ""}
            onChange={(e) => onFieldChange("apartment", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {isEdit ? t("residents.edit.status") : t("residents.create.status")}
          </Typography>
          <select
            value={formData.status || "Aktiv"}
            onChange={(e) => onFieldChange("status", e.target.value || "Aktiv")}
            className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="Aktiv" className="dark:bg-gray-800 dark:text-gray-300">
              {t("residents.status.active")}
            </option>
            <option value="Passiv" className="dark:bg-gray-800 dark:text-gray-300">
              {t("residents.status.passive")}
            </option>
          </select>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {isEdit ? t("residents.edit.cancel") : t("residents.create.cancel")}
        </Button>
        <Button
          color={isEdit ? "blue" : "green"}
          onClick={onSave}
          className={isEdit ? "dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:bg-green-600 dark:hover:bg-green-700"}
        >
          {isEdit ? t("residents.edit.save") : t("residents.create.save")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

