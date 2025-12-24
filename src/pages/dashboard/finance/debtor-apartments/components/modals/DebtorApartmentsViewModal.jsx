import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Chip } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function DebtorApartmentsViewModal({ open, onClose, apartment }) {
  const { t } = useTranslation();

  if (!open || !apartment) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        <Typography variant="h5" className="font-bold">
          {t("debtorApartments.view.title")}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debtorApartments.table.id")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {apartment.id}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debtorApartments.table.apartment")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {apartment.apartment}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debtorApartments.table.apartmentInfo")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debtorApartments.labels.building")}: {apartment.building}, {t("debtorApartments.labels.block")}: {apartment.block}, {t("debtorApartments.labels.floor")}: {apartment.floor}, {t("debtorApartments.labels.area")}: {apartment.area} m²
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debtorApartments.table.owner")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {apartment.owner}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debtorApartments.table.phone")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {apartment.phone}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debtorApartments.table.totalDebt")}
            </Typography>
            <Typography
              variant="small"
              color={parseFloat(apartment.totalDebt) > 0 ? "red" : "green"}
              className={`font-semibold ${parseFloat(apartment.totalDebt) > 0 ? "dark:text-red-400" : "dark:text-green-300"}`}
            >
              {apartment.totalDebt} ₼
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debtorApartments.table.invoiceCount")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {apartment.invoiceCount}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debtorApartments.table.lastPaymentDate")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {apartment.lastPaymentDate}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("debtorApartments.table.status")}
            </Typography>
            <Chip
              size="sm"
              value={apartment.status === "Ödənilib" ? t("debtorApartments.status.paid") : t("debtorApartments.status.debtor")}
              color={apartment.status === "Ödənilib" ? "green" : "red"}
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

