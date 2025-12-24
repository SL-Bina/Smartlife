import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ExpensesDeleteModal({ open, onClose, expense, onConfirm }) {
  const { t } = useTranslation();

  if (!open || !expense) return null;

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        <Typography variant="h5" className="font-bold">
          {t("expenses.delete.title")}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
          {t("expenses.delete.message")} <strong>{expense.description}</strong> (ID: {expense.id})?
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

