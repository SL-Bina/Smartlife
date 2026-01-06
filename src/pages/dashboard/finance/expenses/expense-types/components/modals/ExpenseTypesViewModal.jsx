import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ExpenseTypesViewModal({ open, onClose, expenseType }) {
  const { t } = useTranslation();

  if (!open || !expenseType) return null;

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <EyeIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("expenseTypes.view.title") || "Xərc növü məlumatları"}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenseTypes.table.id") || "ID"}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {expenseType.id}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenseTypes.table.name") || "Ad"}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {expenseType.name}
            </Typography>
          </div>
          <div className="md:col-span-2">
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenseTypes.table.description") || "Açıqlama"}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {expenseType.description || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenseTypes.table.createdAt") || "Yaradılma"}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {formatDate(expenseType.createdAt)}
            </Typography>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.close") || "Bağla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

