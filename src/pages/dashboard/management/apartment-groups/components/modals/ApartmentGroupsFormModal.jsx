import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ApartmentGroupsFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false }) {
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
            {t("apartmentGroups.labels.groupName")}
          </Typography>
          <Input
            placeholder={t("common.enter")}
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
              {t("apartmentGroups.labels.complex")}
            </Typography>
            <Input
              placeholder={t("common.enter")}
              value={formData.complex || ""}
              onChange={(e) => onFieldChange("complex", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("apartmentGroups.labels.building")}
            </Typography>
            <Input
              placeholder={t("common.enter")}
              value={formData.building || ""}
              onChange={(e) => onFieldChange("building", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("apartmentGroups.labels.total")}
            </Typography>
            <Input
              type="number"
              placeholder={t("common.enter")}
              value={formData.total || ""}
              onChange={(e) => onFieldChange("total", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("apartmentGroups.labels.occupied")}
            </Typography>
            <Input
              type="number"
              placeholder={t("common.enter")}
              value={formData.occupied || ""}
              onChange={(e) => onFieldChange("occupied", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("apartmentGroups.labels.serviceFee")}
            </Typography>
            <Input
              type="number"
              placeholder={t("common.enter")}
              value={formData.serviceFee || ""}
              onChange={(e) => onFieldChange("serviceFee", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.cancel")}
        </Button>
        <Button
          color={isEdit ? "blue" : "green"}
          onClick={onSave}
          className={isEdit ? "dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:bg-green-600 dark:hover:bg-green-700"}
        >
          {t("buttons.save")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

