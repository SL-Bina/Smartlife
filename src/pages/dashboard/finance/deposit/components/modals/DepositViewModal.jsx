import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DepositViewModal({ open, onClose, deposit }) {
  const { t } = useTranslation();

  if (!open || !deposit) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <Typography variant="h5" className="font-bold">
          {t("deposit.view.title")}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("deposit.table.id")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {deposit.id}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("deposit.table.apartment")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {deposit.apartment}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("deposit.table.owner")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {deposit.owner}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("deposit.table.amount")}
            </Typography>
            <Typography variant="small" color="green" className="font-semibold dark:text-green-300">
              {deposit.amount} ₼
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("deposit.table.paymentMethod")}
            </Typography>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                deposit.paymentMethod === "Nağd"
                  ? "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              }`}
            >
              {deposit.paymentMethod === "Nağd" ? t("deposit.paymentMethod.cash") : t("deposit.paymentMethod.bank")}
            </span>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("deposit.table.depositDate")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {deposit.depositDate}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("deposit.table.status")}
            </Typography>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                deposit.status === "Aktiv"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {deposit.status === "Aktiv" ? t("deposit.status.active") : t("deposit.status.returned")}
            </span>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("deposit.table.notes")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {deposit.notes}
            </Typography>
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

