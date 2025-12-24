import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Chip } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ExpensesViewModal({ open, onClose, expense }) {
  const { t } = useTranslation();

  if (!open || !expense) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        <Typography variant="h5" className="font-bold">
          {t("expenses.view.title")}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenses.table.id")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {expense.id}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenses.table.category")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {expense.category}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenses.table.description")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {expense.description}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenses.table.amount")}
            </Typography>
            <Typography variant="small" color="red" className="font-semibold dark:text-red-300">
              {expense.amount} ₼
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenses.table.paymentMethod")}
            </Typography>
            <Chip
              size="sm"
              value={expense.paymentMethod === "Nağd" ? t("expenses.paymentMethod.cash") : t("expenses.paymentMethod.bank")}
              color={expense.paymentMethod === "Nağd" ? "amber" : "blue"}
              className="dark:bg-opacity-80"
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenses.table.paymentDate")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {expense.paymentDate}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenses.table.paidBy")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {expense.paidBy}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenses.table.invoiceNumber")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {expense.invoiceNumber}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("expenses.table.status")}
            </Typography>
            <Chip
              size="sm"
              value={expense.status === "Təsdiqlənib" ? t("expenses.status.approved") : t("expenses.status.pending")}
              color={expense.status === "Təsdiqlənib" ? "green" : "amber"}
              className="dark:bg-opacity-80"
            />
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

