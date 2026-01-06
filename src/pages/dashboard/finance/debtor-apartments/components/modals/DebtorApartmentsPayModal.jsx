import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography, Select, Option } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtorApartmentsPayModal({
  open,
  onClose,
  apartment,
  amount,
  onAmountChange,
  note,
  paymentMethod,
  paymentDate,
  onFieldChange,
  onSave,
}) {
  const { t } = useTranslation();

  if (!open || !apartment) return null;

  const totalToPay = amount || apartment.selectedAmount || apartment.totalDebt || 0;
  const title =
    (apartment.selectedInvoicesData && apartment.selectedInvoicesData[0]?.title) ||
    (apartment.selectedInvoicesData && apartment.selectedInvoicesData[0]?.serviceName) ||
    apartment.apartment ||
    "-";

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
            {t("debtorApartments.pay.title") || "Faktura Ödənişi"}
          </Typography>
          <Typography variant="h6" className="font-bold text-red-600 dark:text-red-300">
            {parseFloat(totalToPay || 0).toFixed(2)} AZN
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>

      <DialogBody divider className="space-y-5 dark:bg-gray-800 py-6">
        <div className="bg-blue-50 dark:bg-gray-700/50 p-4 rounded-lg border border-blue-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-semibold">
              {t("debtorApartments.pay.total") || "Toplam"}:
            </Typography>
            <Typography variant="h5" className="font-bold text-red-600 dark:text-red-400">
              {parseFloat(totalToPay || 0).toFixed(2)} AZN
            </Typography>
          </div>
          {title && title !== "-" && (
            <Typography variant="small" className="text-gray-700 dark:text-gray-300">
              {title}
            </Typography>
          )}
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("debtorApartments.pay.amount") || "Məbləğ"} *
          </Typography>
          <Input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || parseFloat(value) >= 0) {
                onAmountChange(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                e.preventDefault();
              }
            }}
            className="dark:text-white border-2 focus:border-blue-500"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("debtorApartments.pay.method") || "Ödəniş üsulu"} *
          </Typography>
          <Select
            value={paymentMethod}
            onChange={(val) => onFieldChange("paymentMethod", val)}
            className="dark:text-white border-2 focus:border-blue-500"
            labelProps={{ className: "dark:text-gray-400" }}
          >
            <Option value="cash">{t("debtorApartments.pay.method.cash") || "Nağd"}</Option>
            <Option value="card">{t("debtorApartments.pay.method.card") || "Kart"}</Option>
            <Option value="bank">{t("debtorApartments.pay.method.bank") || "Bank"}</Option>
          </Select>
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("debtorApartments.pay.date") || "Tarix"}
          </Typography>
          <Input
            type="date"
            value={paymentDate}
            onChange={(e) => onFieldChange("paymentDate", e.target.value)}
            className="dark:text-white border-2 focus:border-blue-500"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("debtorApartments.pay.note") || "Açıqlama"}
          </Typography>
          <Input
            placeholder={t("debtorApartments.pay.notePlaceholder") || "Açıqlama (Optional)"}
            value={note}
            onChange={(e) => onFieldChange("note", e.target.value)}
            className="dark:text-white border-2 focus:border-blue-500"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 px-6"
        >
          {t("buttons.cancel") || "Ləğv et"}
        </Button>
        <Button 
          color="blue" 
          onClick={onSave} 
          className="dark:bg-blue-600 dark:hover:bg-blue-700 px-8 shadow-lg hover:shadow-xl transition-all"
        >
          {t("debtorApartments.pay.confirm") || "Ödənişi təsdiqlə"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

