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

export function RoleFormModal({
  open,
  onClose,
  title,
  formData,
  onFieldChange,
  onSave,
  isEdit = false,
  saving = false,
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
        <Input
          label={t("permissions.roles.form.name") || "Rol adı"}
          value={formData.name || ""}
          onChange={(e) => onFieldChange("name", e.target.value)}
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
          disabled={saving || !formData.name}
          className="dark:bg-purple-600 dark:hover:bg-purple-700"
        >
          {saving ? t("buttons.saving") || "Yadda saxlanır..." : t("buttons.save") || "Yadda saxla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

