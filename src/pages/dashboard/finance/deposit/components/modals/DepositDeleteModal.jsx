import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DepositDeleteModal({ open, onClose, deposit, onConfirm }) {
  const { t } = useTranslation();

  if (!open || !deposit) return null;

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <Typography variant="h5" className="font-bold">
          {t("deposit.delete.title")}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
          {t("deposit.delete.message")} <strong>{deposit.apartment}</strong> (ID: {deposit.id})?
        </Typography>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-3">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.cancel")}
        </Button>
        <Button color="red" onClick={onConfirm} className="dark:bg-red-600 dark:hover:bg-red-700">
          {t("buttons.delete")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

