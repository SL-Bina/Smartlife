import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function PermissionFormModal({
  open,
  onClose,
  title,
  formData,
  onFieldChange,
  onSave,
  saving = false,
  modules = [], 
  isEdit = false,
}) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="dark:bg-gray-900 border border-red-600 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        <Typography variant="h5" className="font-bold">
          {title}
        </Typography>
      </DialogHeader>

      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <div>
          <Typography variant="small" className="mb-1 dark:text-gray-300">
            {t("permissions.permissions.form.module") || "Modul"}
          </Typography>

          <Select
            value={formData.module_id ? String(formData.module_id) : ""}
            onChange={(val) => onFieldChange("module_id", Number(val))}
            disabled={saving}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            required
            placeholder="Rol secin"
          >
            {modules.map((m) => (
              <Option key={m.id} value={String(m.id)}>
                {t(`permissions.modules.${m.name}`) || m.name}
              </Option>
            ))}
          </Select>
        </div>

        <Input
          label={t("permissions.permissions.form.name") || "Permission name"}
          value={formData.permission_name || ""}
          onChange={(e) => onFieldChange("permission_name", e.target.value)}
          className="dark:text-white"
          labelProps={{ className: "dark:text-gray-400" }}
          required
        />

        <Input
          label={t("permissions.permissions.form.detail") || "Permission detail"}
          value={formData.permission_detail || ""}
          onChange={(e) => onFieldChange("permission_detail", e.target.value)}
          className="dark:text-white"
          labelProps={{ className: "dark:text-gray-400" }}
          required
        />
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-3">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={saving}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.cancel") || "Ləğv et"}
        </Button>

        <Button
          color="purple"
          onClick={onSave}
          disabled={
            saving ||
            !formData.module_id ||
            !formData.permission_name ||
            !formData.permission_detail
          }
          className="dark:bg-purple-600 dark:hover:bg-purple-700"
        >
          {saving
            ? t("buttons.saving") || "Yadda saxlanır..."
            : isEdit
            ? t("buttons.update") || "Yenilə"
            : t("buttons.save") || "Yadda saxla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
