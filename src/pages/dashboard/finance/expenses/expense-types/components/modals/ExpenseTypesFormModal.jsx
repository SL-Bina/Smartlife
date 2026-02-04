import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ExpenseTypesFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false }) {
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
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("expenseTypes.form.name") || "Ad"}
          </Typography>
          <Input
            placeholder={t("expenseTypes.form.name") || "Ad"}
            value={formData.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("expenseTypes.form.description") || "Açıqlama"}
          </Typography>
          <textarea
            placeholder={t("expenseTypes.form.description") || "Açıqlama"}
            value={formData.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 text-sm font-normal text-blue-gray-700 bg-white bg-clip-padding border border-blue-gray-300 rounded-lg transition-all placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.cancel") || "Ləğv et"}
        </Button>
        <Button
          color={isEdit ? "blue" : "green"}
          onClick={onSave}
          className={isEdit ? "dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:bg-green-600 dark:hover:bg-green-700"}
        >
          {isEdit ? (t("buttons.save") || "Yadda saxla") : (t("expenseTypes.actions.add") || "Əlavə et")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

