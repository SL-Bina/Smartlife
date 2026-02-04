import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtViewModal({ open, onClose, debt }) {
  const { t } = useTranslation();

  if (!open || !debt) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <Typography variant="h5" className="font-bold">
          {t("debt.view.title")}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debt.table.id")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {debt.id}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debt.table.creditor")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {debt.creditor}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debt.table.debtor")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {debt.debtor}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debt.table.amount")}
            </Typography>
            <Typography variant="small" color="red" className="font-semibold dark:text-red-300">
              {debt.amount} ₼
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debt.table.category")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {debt.category}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debt.table.debtDate")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {debt.debtDate}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debt.table.dueDate")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {debt.dueDate}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debt.table.description")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {debt.description}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debt.table.status")}
            </Typography>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                debt.status === "Ödənilib"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {debt.status === "Ödənilib" ? t("debt.status.paid") : t("debt.status.active")}
            </span>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-3">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.close")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

