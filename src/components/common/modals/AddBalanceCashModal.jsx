import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { XMarkIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import api from "@/services/api";

/**
 * Shared modal for adding cash balance to a property.
 * POST /module/finance/add-balance-in-cash
 * Body: { property_id, amount, balance_type: "cash" }
 *
 * Props:
 *   open        – boolean
 *   onClose     – () => void
 *   propertyId  – number | null
 *   propertyName – string (display only)
 *   onSuccess   – () => void  (called after successful top-up, e.g. to refresh data)
 */
export function AddBalanceCashModal({ open, onClose, propertyId, propertyName, onSuccess }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", message: "" });

  const showToast = (type, message) => setToast({ open: true, type, message });

  // Open/close native dialog
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
      setAmount("");
    } else {
      if (el.open) el.close();
    }
  }, [open]);

  // Handle native dialog cancel (Escape key)
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handleCancel = (e) => { e.preventDefault(); onClose(); };
    el.addEventListener("cancel", handleCancel);
    return () => el.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      showToast("error", t("addBalance.errors.amountRequired") || "Məbləğ daxil edin");
      return;
    }
    if (!propertyId) {
      showToast("error", t("addBalance.errors.noProperty") || "Mənzil seçilməyib");
      return;
    }

    setSaving(true);
    try {
      const response = await api.post("/module/finance/add-balance-in-cash", {
        property_id: propertyId,
        amount: numericAmount,
        balance_type: "cash",
      });
      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Xəta");
      }
      showToast("success", t("addBalance.success") || "Balans uğurla əlavə edildi");
      setAmount("");
      onSuccess?.();
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      showToast("error", err?.response?.data?.message || err?.message || t("addBalance.errors.failed") || "Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}
      className="p-0 rounded-xl shadow-2xl border-0 max-w-md w-full backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-transparent"
    >
      {/* Dialog panel */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <BanknotesIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
              {t("addBalance.title") || "Balans əlavə et"}
            </Typography>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 px-5 space-y-4">
          {/* Property name */}
          {propertyName && (
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                {t("addBalance.property") || "Mənzil"}
              </Typography>
              <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                {propertyName}
              </Typography>
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("addBalance.amount") || "Məbləğ (AZN)"}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !saving && handleSubmit()}
              placeholder={t("addBalance.amountPlaceholder") || "0.00"}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all"
            />
          </div>

          {/* Balance type info */}
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <BanknotesIcon className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
            <Typography variant="small" className="text-green-700 dark:text-green-400">
              {t("addBalance.cashNote") || "Nağd ödəniş balansa əlavə ediləcək"}
            </Typography>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-800">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onClose}
            disabled={saving}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("buttons.cancel") || "Ləğv et"}
          </Button>
          <Button
            color="green"
            onClick={handleSubmit}
            disabled={saving || !amount}
            className="flex items-center gap-2"
          >
            {saving && <Spinner className="h-4 w-4" />}
            {t("addBalance.submit") || "Əlavə et"}
          </Button>
        </div>
      </div>     </dialog>
  );
}
