import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { XMarkIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { fetchPaymentMethods } from "@/services/finance/invoicesApi";

const emptyForm = {
  amount_paid: "",
  payment_method_id: "",
  desc: "",
  paid_at: "",
};

export function PaymentModal({ open, onClose, invoice, onSuccess, onPay, allowPartialPayment = false }) {
  const { t } = useTranslation();

  const [form, setForm] = useState(emptyForm);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const remaining =
    invoice
      ? Math.max(
          0,
          parseFloat(invoice.amount || 0) - parseFloat(invoice.amount_paid || 0)
        ).toFixed(2)
      : "0.00";

  const remainingAmount = parseFloat(remaining || 0);

  // Prefill amount and fetch methods when opening
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm({
      ...emptyForm,
      amount_paid: remaining,
    });
    setLoadingMethods(true);
    fetchPaymentMethods()
      .then((data) => setPaymentMethods(Array.isArray(data) ? data : []))
      .catch(() => setPaymentMethods([]))
      .finally(() => setLoadingMethods(false));
  }, [open, remaining]);

  const validate = () => {
    const errs = {};
    const amt = parseFloat(form.amount_paid);
    if (!form.amount_paid || isNaN(amt) || amt <= 0) {
      errs.amount_paid = t("invoices.pay.errors.amountRequired") || "Məbləğ daxil edin";
    } else if (amt - remainingAmount > 0.0001) {
      errs.amount_paid = "Məbləğ qalıq borcdan çox ola bilməz";
    } else if (!allowPartialPayment && Math.abs(amt - remainingAmount) > 0.0001) {
      errs.amount_paid = "Bu kompleksdə qismən ödəniş aktiv deyil. Qalıq məbləği tam ödəməlisiniz";
    }
    if (!form.payment_method_id) {
      errs.payment_method_id =
        t("invoices.pay.errors.methodRequired") || "Ödəniş metodunu seçin";
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      setSaving(true);
      const payload = {
        id: invoice.id,
        amount_paid: parseFloat(form.amount_paid),
        payment_method_id: parseInt(form.payment_method_id, 10),
        desc: form.desc || undefined,
        paid_at: form.paid_at || undefined,
      };
      if (typeof onPay === "function") {
        await onPay(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors({
        submit:
          err?.response?.data?.message ||
          err?.message ||
          (t("invoices.pay.errors.failed") || "Ödəniş zamanı xəta baş verdi"),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      handler={handleClose}
      size="sm"
      className="dark:bg-gray-900"
    >
      <DialogHeader className="flex items-center justify-between pb-2 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h6" className="text-gray-800 dark:text-gray-100">
            {t("invoices.pay.title") || "Faktura Ödənişi"}
          </Typography>
        </div>
        <button
          onClick={handleClose}
          disabled={saving}
          className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </DialogHeader>

      <DialogBody className="flex flex-col gap-4 pt-4">
        {/* Invoice summary */}
        {invoice && (
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex justify-between items-center mb-1">
              <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                {t("invoices.pay.invoiceId") || "Faktura ID"}
              </Typography>
              <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
                #{invoice.id}
              </Typography>
            </div>
            <div className="flex justify-between items-center mb-1">
              <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                {t("invoices.table.amount") || "Ümumi məbləğ"}
              </Typography>
              <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
                {parseFloat(invoice.amount || 0).toFixed(2)} ₼
              </Typography>
            </div>
            <div className="flex justify-between items-center mb-1">
              <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                {t("invoices.table.paidAmount") || "Ödənilmiş"}
              </Typography>
              <Typography variant="small" className="font-semibold text-green-600 dark:text-green-400">
                {parseFloat(invoice.amount_paid || 0).toFixed(2)} ₼
              </Typography>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
              <Typography variant="small" className="text-gray-600 dark:text-gray-300 font-medium">
                {t("invoices.table.remaining") || "Qalıq"}
              </Typography>
              <Typography
                variant="small"
                className={`font-bold ${parseFloat(remaining) > 0 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}
              >
                {remaining} ₼
              </Typography>
            </div>
          </div>
        )}

        {/* Amount paid */}
        <div>
          <Input
            label={
              allowPartialPayment
                ? (t("invoices.pay.amountPaid") || "Ödəniləcək məbləğ (₼)")
                : "Ödəniləcək məbləğ (tam qalıq)"
            }
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount_paid}
            disabled={!allowPartialPayment}
            onChange={(e) => {
              if (!allowPartialPayment) return;
              setForm((f) => ({ ...f, amount_paid: e.target.value }));
              setErrors((er) => ({ ...er, amount_paid: undefined }));
            }}
            error={!!errors.amount_paid}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-400" }}
          />
          {errors.amount_paid && (
            <Typography variant="small" className="text-red-500 mt-1 text-xs">
              {errors.amount_paid}
            </Typography>
          )}
          {!allowPartialPayment && (
            <Typography variant="small" className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
              Bu kompleksdə `pre_paid` deaktivdir. Yalnız qalıq məbləğin tam ödənişi mümkündür.
            </Typography>
          )}
        </div>

        {/* Payment method */}
        <div>
          <div className="relative">
            <select
              value={form.payment_method_id}
              onChange={(e) => {
                setForm((f) => ({ ...f, payment_method_id: e.target.value }));
                setErrors((er) => ({ ...er, payment_method_id: undefined }));
              }}
              disabled={loadingMethods}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none transition-all
                ${errors.payment_method_id
                  ? "border-red-500 focus:border-red-500"
                  : "border-blue-gray-200 dark:border-gray-600 focus:border-blue-500"
                }
                disabled:opacity-60`}
            >
              <option value="">
                {loadingMethods
                  ? (t("invoices.pay.loadingMethods") || "Yüklənir...")
                  : (t("invoices.pay.selectMethod") || "Ödəniş metodu seçin")}
              </option>
              {paymentMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                  {m.category ? ` — ${m.category}` : ""}
                </option>
              ))}
            </select>
            {loadingMethods && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Spinner className="h-4 w-4" />
              </div>
            )}
          </div>
          {errors.payment_method_id && (
            <Typography variant="small" className="text-red-500 mt-1 text-xs">
              {errors.payment_method_id}
            </Typography>
          )}
        </div>

        {/* Paid at (optional) */}
        <div>
          <Input
            label={t("invoices.pay.paidAt") || "Ödəniş tarixi (istəyə bağlı)"}
            type="date"
            value={form.paid_at}
            onChange={(e) => setForm((f) => ({ ...f, paid_at: e.target.value }))}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>

        {/* Description (optional) */}
        <div>
          <Textarea
            label={t("invoices.pay.desc") || "Qeyd (istəyə bağlı)"}
            value={form.desc}
            onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
            rows={3}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>

        {/* Submit error */}
        {errors.submit && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2">
            <Typography variant="small" className="text-red-600 dark:text-red-400">
              {errors.submit}
            </Typography>
          </div>
        )}
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={handleClose}
          disabled={saving}
          className="dark:text-gray-300 dark:border-gray-600"
        >
          {t("common.cancel") || "Ləğv et"}
        </Button>
        <Button
          variant="gradient"
          color="blue"
          onClick={handleSubmit}
          disabled={saving || loadingMethods}
          className="flex items-center gap-2"
        >
          {saving && <Spinner className="h-4 w-4" />}
          {t("invoices.pay.submit") || "Ödə"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
