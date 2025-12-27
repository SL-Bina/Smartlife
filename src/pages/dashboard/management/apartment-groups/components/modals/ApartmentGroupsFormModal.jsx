import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ApartmentGroupsFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-900" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:bg-gray-800 dark:text-white">{title}</DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("apartmentGroups.labels.groupName")}
          </Typography>
          <Input
            label={t("common.enter")}
            value={formData.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("apartmentGroups.labels.complex")}
            </Typography>
            <Input
              label={t("common.enter")}
              value={formData.complex}
              onChange={(e) => onFieldChange("complex", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("apartmentGroups.labels.building")}
            </Typography>
            <Input
              label={t("common.enter")}
              value={formData.building}
              onChange={(e) => onFieldChange("building", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("apartmentGroups.labels.total")}
            </Typography>
            <Input
              type="number"
              label={t("common.enter")}
              value={formData.total}
              onChange={(e) => onFieldChange("total", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("apartmentGroups.labels.occupied")}
            </Typography>
            <Input
              type="number"
              label={t("common.enter")}
              value={formData.occupied}
              onChange={(e) => onFieldChange("occupied", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("apartmentGroups.labels.serviceFee")}
            </Typography>
            <Input
              type="number"
              label={t("common.enter")}
              value={formData.serviceFee}
              onChange={(e) => onFieldChange("serviceFee", e.target.value)}
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

