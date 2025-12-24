import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Select, Option, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ResidentsFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-900" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:bg-gray-800 dark:text-white">{title}</DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {isEdit ? t("residents.edit.fullName") : t("residents.create.fullName")}
          </Typography>
          <Input
            label={isEdit ? t("residents.edit.enterFullName") : t("residents.create.enterFullName")}
            value={formData.fullName}
            onChange={(e) => onFieldChange("fullName", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {isEdit ? t("residents.edit.phone") : t("residents.create.phone")}
            </Typography>
            <Input
              label={isEdit ? t("residents.edit.enterPhone") : t("residents.create.enterPhone")}
              value={formData.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {isEdit ? t("residents.edit.email") : t("residents.create.email")}
            </Typography>
            <Input
              label={isEdit ? t("residents.edit.enterEmail") : t("residents.create.enterEmail")}
              value={formData.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {isEdit ? t("residents.edit.apartment") : t("residents.create.apartment")}
          </Typography>
          <Input
            label={isEdit ? t("residents.edit.enterApartment") : t("residents.create.enterApartment")}
            value={formData.apartment}
            onChange={(e) => onFieldChange("apartment", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {isEdit ? t("residents.edit.status") : t("residents.create.status")}
          </Typography>
          <Select
            label={isEdit ? t("residents.edit.enterStatus") : t("residents.create.enterStatus")}
            value={formData.status}
            onChange={(val) => onFieldChange("status", val || "Aktiv")}
            className="dark:text-white"
          >
            <Option value="Aktiv">{t("residents.status.active")}</Option>
            <Option value="Passiv">{t("residents.status.passive")}</Option>
          </Select>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
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

