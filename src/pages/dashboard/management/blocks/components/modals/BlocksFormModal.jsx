import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function BlocksFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-900" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:bg-gray-800 dark:text-white">{title}</DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {isEdit ? t("blocks.edit.block") : t("blocks.create.block")}
          </Typography>
          <Input
            label={isEdit ? t("blocks.edit.enterBlock") : t("blocks.create.enterBlock")}
            value={formData.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {isEdit ? t("blocks.edit.building") : t("blocks.create.building")}
          </Typography>
          <Input
            label={isEdit ? t("blocks.edit.enterBuilding") : t("blocks.create.enterBuilding")}
            value={formData.building}
            onChange={(e) => onFieldChange("building", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {isEdit ? t("blocks.edit.floorsCount") : t("blocks.create.floorsCount")}
            </Typography>
            <Input
              type="number"
              label={isEdit ? t("blocks.edit.enterFloors") : t("blocks.create.enterFloors")}
              value={formData.floors}
              onChange={(e) => onFieldChange("floors", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {isEdit ? t("blocks.edit.apartmentsCount") : t("blocks.create.apartmentsCount")}
            </Typography>
            <Input
              type="number"
              label={isEdit ? t("blocks.edit.enterApartments") : t("blocks.create.enterApartments")}
              value={formData.apartments}
              onChange={(e) => onFieldChange("apartments", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {isEdit ? t("blocks.edit.cancel") : t("blocks.create.cancel")}
        </Button>
        <Button
          color={isEdit ? "blue" : "green"}
          onClick={onSave}
          className={isEdit ? "dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:bg-green-600 dark:hover:bg-green-700"}
        >
          {isEdit ? t("blocks.edit.save") : t("blocks.create.save")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

