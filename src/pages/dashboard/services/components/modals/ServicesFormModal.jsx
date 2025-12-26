import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { InformationCircleIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

export function ServicesFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false, saving = false }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="dark:bg-gray-900 border border-red-600 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
        <Typography variant="h5" className="font-bold">
          {title}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto">
        <div className="space-y-6 py-2">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("services.form.basicInfo")}
              </Typography>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("services.form.name")} <span className="text-red-500">*</span>
                </Typography>
                <Input
                  label={t("services.form.enterName")}
                  value={formData.name || ""}
                  onChange={(e) => onFieldChange("name", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  required
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("services.form.description")}
                </Typography>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => onFieldChange("description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-blue-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                  rows={4}
                  placeholder={t("services.form.enterDescription")}
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                  {t("services.form.price")} <span className="text-red-500">*</span>
                </Typography>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  label={t("services.form.enterPrice")}
                  value={formData.price || ""}
                  onChange={(e) => onFieldChange("price", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={saving}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
        >
          {t("services.filter.close") || t("services.cancel")}
        </Button>
        <Button
          color="green"
          onClick={onSave}
          disabled={saving}
          className="dark:bg-green-600 dark:hover:bg-green-700 min-w-[100px]"
        >
          {saving ? t("services.saving") || "Yadda saxlanılır..." : t("services.save") || "Yadda saxla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

