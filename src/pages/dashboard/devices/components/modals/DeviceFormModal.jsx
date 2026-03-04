import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { CpuChipIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useTranslation } from "react-i18next";

export function DeviceFormModal({ open, mode, onClose, formData, errors, onChange, onSave }) {
  const { t } = useTranslation();
  const isEdit = mode === "edit";

  const STATUS_OPTIONS = [
    { value: "Onlayn", label: t("devices.status.online") || "Onlayn" },
    { value: "Offline", label: t("devices.status.offline") || "Offline" },
  ];

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-900 !min-w-0 max-w-md">
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <CpuChipIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold">
            {isEdit ? t("devices.edit.title") || "Cihazı redaktə et" : t("devices.create.title") || "Yeni cihaz"}
          </Typography>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </DialogHeader>

      <DialogBody className="px-6 py-5 space-y-4 dark:bg-gray-900">
        <CustomInput
          label={t("devices.create.name") || "Ad"}
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder={t("devices.create.enterName") || "Ad daxil edin"}
          error={errors.name}
        />
        <div className="grid grid-cols-2 gap-3">
          <CustomInput
            label={t("devices.create.building") || "Bina"}
            value={formData.building}
            onChange={(e) => onChange("building", e.target.value)}
            placeholder="12"
          />
          <CustomInput
            label={t("devices.create.apartment") || "Mənzil"}
            value={formData.apartment}
            onChange={(e) => onChange("apartment", e.target.value)}
            placeholder="45/01"
          />
        </div>
        <CustomSelect
          label={t("devices.create.status") || "Status"}
          value={formData.status}
          onChange={(val) => onChange("status", val || "Onlayn")}
          options={STATUS_OPTIONS}
          placeholder={t("devices.create.enterStatus") || "Status seçin"}
        />
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 px-6 pb-5 dark:bg-gray-900">
        <Button variant="text" color="blue-gray" onClick={onClose} className="dark:text-gray-300">
          {t("devices.create.cancel") || "Ləğv et"}
        </Button>
        <Button color="blue" onClick={onSave}>
          {t("devices.create.save") || "Saxla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
