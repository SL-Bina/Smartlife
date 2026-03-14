import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";

export function DeviceUserFormModal({ open, onClose, formData, errors = {}, onChange, onSave, saving, complexes = [] }) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-900 z-[140]" dismiss={{ enabled: false }}>
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <UserPlusIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold">
            {t("devices.deviceUsers.addUserTitle") || "Yeni istifadəçi əlavə et"}
          </Typography>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </DialogHeader>

      <DialogBody className="px-6 py-5 space-y-3 dark:bg-gray-900 h-[58vh] overflow-y-auto">
        <CustomInput
          label={t("devices.deviceUsers.form.name") || "Ad"}
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={errors.name}
        />
        <CustomInput
          label={t("devices.deviceUsers.form.email") || "E-poçt"}
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
        />
        <CustomInput
          label={t("devices.deviceUsers.form.phone") || "Telefon"}
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          error={errors.phone}
        />
        <CustomInput
          label={t("devices.deviceUsers.form.domainId") || "Domain ID"}
          type="number"
          value={formData.domain_id}
          onChange={(e) => onChange("domain_id", e.target.value)}
          error={errors.domain_id}
        />
        <CustomSelect
          label={t("devices.deviceUsers.form.complexId") || "Complex"}
          value={formData.complex_id ? String(formData.complex_id) : ""}
          onChange={(value) => onChange("complex_id", Number(value))}
          options={[{ value: "", label: t("devices.deviceUsers.selectComplex") || "Kompleks seçin" }, ...complexes.map((c) => ({ value: String(c.id), label: c.name || c.title || `Complex ${c.id}`}))]}
          placeholder={t("devices.deviceUsers.selectComplex") || "Kompleks seçin"}
          error={errors.complex_id}
        />
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 px-6 py-4 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Button variant="text" color="blue-gray" onClick={onClose} className="dark:text-gray-300">
          {t("devices.actions.cancel") || "Ləğv et"}
        </Button>
        <Button color="blue" onClick={onSave} disabled={saving}>
          {saving ? t("devices.actions.saving") || "Yadda saxlanır..." : t("devices.actions.save") || "Saxla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
