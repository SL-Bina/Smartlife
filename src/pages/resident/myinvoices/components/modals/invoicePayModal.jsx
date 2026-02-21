import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Spinner,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import residentInvoicesAPI from "../../api";

export function InvoicePayModal({ open, onClose, invoiceId, onSuccess }) {
  const { t } = useTranslation();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (open && invoiceId) {
      fetchInvoice();
    } else {
      resetState();
    }
  }, [open, invoiceId]);

  const resetState = () => {
    setInvoice(null);
    setAmount("");
    setPaymentMethod("");
  };

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await residentInvoicesAPI.getById(invoiceId);
      if (res?.success) {
        setInvoice(res.data);
        const remaining =
          (res.data.amount || 0) - (res.data.amount_paid || 0);
        setAmount(remaining.toFixed(2));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) return;

    setPaying(true);
    try {
      const res = await residentInvoicesAPI.pay(invoiceId, {
        amount: Number(amount),
        payment_method: paymentMethod,
      });

      if (res?.success) {
        onSuccess?.();
        onClose();
      }
    } finally {
      setPaying(false);
    }
  };

  const remaining =
    invoice ? (invoice.amount || 0) - (invoice.amount_paid || 0) : 0;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="flex items-center justify-between border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
          <Typography variant="h5" className="font-bold">
            {t("invoices.pay") || "Faktura Ödə"}
          </Typography>
        </div>
        <XMarkIcon
          onClick={onClose}
          className="h-5 w-5 cursor-pointer"
        />
      </DialogHeader>

      <DialogBody className="py-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner className="h-8 w-8" />
          </div>
        ) : invoice ? (
          <div className="space-y-6">

            {/* Remaining */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
              <Typography variant="small" className="text-gray-600">
                {t("invoices.remaining") || "Qalıq məbləğ"}
              </Typography>
              <Typography variant="h4" className="font-bold text-green-600">
                {remaining.toFixed(2)} ₼
              </Typography>
            </div>

            {/* Amount */}
            <Input
              label={t("invoices.payAmount") || "Ödəniş məbləği"}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {/* Payment Method */}
            <Select
              label={t("invoices.paymentMethod") || "Ödəniş üsulu"}
              value={paymentMethod}
              onChange={(val) => setPaymentMethod(val)}
            >
              <Option value="cash">Nağd</Option>
              <Option value="card">Kart</Option>
              <Option value="transfer">Köçürmə</Option>
            </Select>

          </div>
        ) : (
          <Typography className="text-center text-gray-500">
            {t("invoices.noData") || "Məlumat yoxdur"}
          </Typography>
        )}
      </DialogBody>

      <DialogFooter className="border-t dark:border-gray-700">
        <Button variant="text" onClick={onClose}>
          {t("buttons.cancel") || "Ləğv et"}
        </Button>

        <Button
          color="green"
          onClick={handlePay}
          loading={paying}
          disabled={!amount || !paymentMethod}
        >
          {t("invoices.payNow") || "Ödə"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}