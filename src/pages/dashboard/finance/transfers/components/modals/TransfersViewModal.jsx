import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Chip } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function TransfersViewModal({ open, onClose, transfer }) {
  const { t } = useTranslation();

  if (!open || !transfer) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        <Typography variant="h5" className="font-bold">
          {t("transfers.view.title")}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("transfers.table.id")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {transfer.id}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("transfers.table.fromAccount")}
            </Typography>
            <Chip
              size="sm"
              value={transfer.fromAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
              color={transfer.fromAccount === "Nağd" ? "amber" : "blue"}
              className="dark:bg-opacity-80"
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("transfers.table.toAccount")}
            </Typography>
            <Chip
              size="sm"
              value={transfer.toAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
              color={transfer.toAccount === "Nağd" ? "amber" : "blue"}
              className="dark:bg-opacity-80"
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("transfers.table.amount")}
            </Typography>
            <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
              {transfer.amount} ₼
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("transfers.table.transferDate")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {transfer.transferDate}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("transfers.table.description")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {transfer.description}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("transfers.table.referenceNumber")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {transfer.referenceNumber}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("transfers.table.status")}
            </Typography>
            <Chip
              size="sm"
              value={transfer.status === "Tamamlanıb" ? t("transfers.status.completed") : t("transfers.status.pending")}
              color={transfer.status === "Tamamlanıb" ? "green" : "amber"}
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

