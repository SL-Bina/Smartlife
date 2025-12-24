import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Chip } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function InvoicesViewModal({ open, onClose, invoice }) {
  const { t } = useTranslation();

  if (!open || !invoice) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        <Typography variant="h5" className="font-bold">
          {t("invoices.view.title")}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.id")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {invoice.id}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.serviceName")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {invoice.serviceName}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.owner")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {invoice.owner}
            </Typography>
            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
              {t("invoices.labels.balance")}: {invoice.ownerBalance} ₼
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.apartmentInfo")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {invoice.apartment}
            </Typography>
            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
              {t("invoices.labels.building")}: {invoice.building}, {t("invoices.labels.block")}: {invoice.block}, {t("invoices.labels.floor")}: {invoice.floor}, {t("invoices.labels.area")}: {invoice.area} m²
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.amount")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {invoice.amount} ₼
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.paidAmount")}
            </Typography>
            <Typography variant="small" color="green" className="font-semibold dark:text-green-300">
              {invoice.paidAmount} ₼
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.remaining")}
            </Typography>
            <Typography
              variant="small"
              color={parseFloat(invoice.remaining) > 0 ? "red" : "blue-gray"}
              className={`font-semibold ${parseFloat(invoice.remaining) > 0 ? "dark:text-red-400" : "dark:text-gray-300"}`}
            >
              {invoice.remaining} ₼
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.status")}
            </Typography>
            <Chip
              size="sm"
              value={invoice.status === "Ödənilib" ? t("invoices.status.paid") : t("invoices.status.unpaid")}
              color={invoice.status === "Ödənilib" ? "green" : "red"}
              className="dark:bg-opacity-80"
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.invoiceDate")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {invoice.invoiceDate}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.paymentDate")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {invoice.paymentDate || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("invoices.table.paymentMethod")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {invoice.paymentMethod || "-"}
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

