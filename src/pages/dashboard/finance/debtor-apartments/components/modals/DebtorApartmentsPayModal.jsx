import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function DebtorApartmentsPayModal({ open, onClose, apartment, amount, onAmountChange, onSave }) {
  const { t } = useTranslation();

  if (!open || !apartment) return null;

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        <Typography variant="h5" className="font-bold">
          {t("debtorApartments.pay.title")}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("debtorApartments.table.totalDebt")}
          </Typography>
          <Typography variant="small" color="red" className="font-semibold dark:text-red-300">
            {apartment.totalDebt} ₼
          </Typography>
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("debtorApartments.pay.amount")}
          </Typography>
          <Input
            type="number"
            label={t("debtorApartments.filter.enter")}
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
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
        <Button color="green" onClick={onSave} className="dark:bg-green-600 dark:hover:bg-green-700">
          {t("buttons.save")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

