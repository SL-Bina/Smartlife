import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Chip } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function PaymentHistoryViewModal({ open, onClose, payment }) {
  const { t } = useTranslation();

  if (!open || !payment) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        <Typography variant="h5" className="font-bold">
          {t("paymentHistory.view.title")}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("paymentHistory.table.id")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {payment.id}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("paymentHistory.table.payer")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {payment.payer}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("paymentHistory.table.apartmentInfo")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {payment.apartment}
            </Typography>
            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
              {t("paymentHistory.labels.building")}: {payment.building}, {t("paymentHistory.labels.block")}: {payment.block}, {t("paymentHistory.labels.floor")}: {payment.floor}, {t("paymentHistory.labels.area")}: {payment.area} m²
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("paymentHistory.table.amount")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {payment.amount} AZN
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("paymentHistory.table.paymentDate")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {payment.paymentDate}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("paymentHistory.table.status")}
            </Typography>
            <Chip size="sm" value={t("paymentHistory.status.successful")} color="green" className="dark:bg-opacity-80" />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("paymentHistory.table.transactionType")}
            </Typography>
            <Chip size="sm" value={t("paymentHistory.transactionType.income")} color="green" className="dark:bg-opacity-80" />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("paymentHistory.table.paymentType")}
            </Typography>
            <Chip
              size="sm"
              value={payment.paymentType === "Nağd" ? t("paymentHistory.paymentType.cash") : t("paymentHistory.paymentType.balance")}
              color={payment.paymentType === "Nağd" ? "amber" : "blue"}
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

