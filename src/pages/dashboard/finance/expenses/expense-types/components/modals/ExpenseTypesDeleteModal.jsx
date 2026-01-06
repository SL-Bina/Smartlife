import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ExpenseTypesDeleteModal({ open, onClose, expenseType, onConfirm }) {
  const { t } = useTranslation();

  if (!open || !expenseType) return null;

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500 rounded-lg">
            <TrashIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("expenseTypes.delete.title") || "Xərc növü sil"}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6">
        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
          {t("expenseTypes.delete.message") || "Bu xərc növünü silmək istədiyinizə əminsiniz?"} <strong>{expenseType.name}</strong> (ID: {expenseType.id})?
        </Typography>
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
        <Button color="red" onClick={onConfirm} className="dark:bg-red-600 dark:hover:bg-red-700">
          {t("buttons.delete") || "Sil"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

