import React, { useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  HomeIcon,
  ClockIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function InvoiceDetailModal({ open, onClose, invoice }) {
  const { t } = useTranslation();

  // Set z-index for portal container when modal is open
  useEffect(() => {
    if (open) {
      const setDialogZIndex = () => {
        const dialogs = document.querySelectorAll('div[role="dialog"]');
        dialogs.forEach((dialog) => {
          if (dialog instanceof HTMLElement) {
            dialog.style.zIndex = '999999';
          }
          let parent = dialog.parentElement;
          while (parent && parent !== document.body) {
            if (parent instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(parent);
              if (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') {
                parent.style.zIndex = '999999';
              }
            }
            parent = parent.parentElement;
          }
        });
        const backdrops = document.querySelectorAll('[class*="backdrop"]');
        backdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.style.zIndex = '999998';
          }
        });
      };
      setDialogZIndex();
      const timeout = setTimeout(setDialogZIndex, 10);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const parseAmount = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "green";
      case "unpaid":
      case "not_paid":
        return "red";
      case "pending":
        return "yellow";
      case "overdue":
        return "red";
      case "pre_paid":
        return "purple";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      paid: t("invoices.status.paid") || "Ödənilib",
      unpaid: t("invoices.status.unpaid") || "Ödənilməmiş",
      not_paid: t("invoices.status.unpaid") || "Ödənilməmiş",
      pending: t("invoices.filter.pending") || "Gözləyir",
      overdue: t("invoices.filter.overdue") || "Gecikmiş",
      pre_paid: t("invoices.status.prePaid") || "Ön ödəniş",
    };
    return statusMap[status] || status;
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      one_time: t("invoices.type.oneTime") || "Birdəfəlik",
      monthly: t("invoices.type.monthly") || "Aylıq",
      yearly: t("invoices.type.yearly") || "İllik",
    };
    return typeMap[type] || type || "-";
  };

  const getPaymentMethodLabel = (method) => {
    if (!method && method !== 0) return "-";
    if (typeof method === "object") return method.name || "-";
    const methodMap = {
      1: t("invoices.paymentMethod.bank") || "Bank",
      2: t("invoices.paymentMethod.cash") || "Nəğd",
      3: t("invoices.paymentMethod.online") || "Onlayn",
    };
    return methodMap[method] || `#${method}`;
  };

  const amount = parseAmount(invoice?.amount);
  const amountPaid = parseAmount(invoice?.amount_paid);
  const remaining = amount - amountPaid;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="h-5 w-5 text-green-500" />
          <Typography variant="h5" className="font-bold">
            {t("resident.invoices.pageTitle") || t("invoices.pageTitle") || "Faktura Detalları"}
          </Typography>
        </div>
        <div
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>

      <DialogBody divider className="dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        {invoice ? (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h5" className="font-bold text-gray-800 dark:text-white mb-1">
                    {invoice.service?.name || (t("resident.invoices.service") || "Xidmət") + ` #${invoice.service_id}`}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {t("invoices.table.id") || "ID"}: {invoice.id}
                  </Typography>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getStatusColor(invoice.status)}-100 text-${getStatusColor(invoice.status)}-800 dark:bg-${getStatusColor(invoice.status)}-900/30 dark:text-${getStatusColor(invoice.status)}-400`}>
                  {getStatusLabel(invoice.status)}
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <HomeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t("properties.pageTitle") || "Əmlak"}
              </Typography>
              <Typography variant="h6" className="font-semibold text-gray-800 dark:text-white">
                {invoice.property?.name || (t("properties.property") || "Əmlak") + ` #${invoice.property_id}`}
              </Typography>
            </div>

            {/* Financial Info */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                {t("invoices.table.amount") || "Maliyyə Məlumatları"}
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium">
                    {t("resident.invoices.amount") || t("invoices.amount") || "Məbləğ"}:
                  </Typography>
                  <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">
                    {amount.toFixed(2)} ₼
                  </Typography>
                </div>
                {amountPaid > 0 && (
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium">
                      {t("resident.invoices.paidAmount") || t("invoices.paidAmount") || "Ödənilən"}:
                    </Typography>
                    <Typography variant="h6" className="font-bold text-green-600 dark:text-green-400">
                      {amountPaid.toFixed(2)} ₼
                    </Typography>
                  </div>
                )}
                {remaining > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium">
                      {t("invoices.table.remaining") || "Qalıq"}:
                    </Typography>
                    <Typography variant="h6" className="font-bold text-red-600 dark:text-red-400">
                      {remaining.toFixed(2)} ₼
                    </Typography>
                  </div>
                )}
              </div>
            </div>

            {/* Type & Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {invoice.type && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <Typography variant="h6" className="font-bold mb-2 text-gray-800 dark:text-white flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    {t("invoices.form.type") || "Növ"}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {getTypeLabel(invoice.type)}
                  </Typography>
                </div>
              )}
              {invoice.payment_method != null && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <Typography variant="h6" className="font-bold mb-2 text-gray-800 dark:text-white flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    {t("invoices.table.paymentMethod") || "Ödəniş üsulu"}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {getPaymentMethodLabel(invoice.payment_method)}
                  </Typography>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t("properties.dates") || "Tarixlər"}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invoice.start_date && (
                  <div>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {t("invoices.form.startDate") || "Başlama tarixi"}
                    </Typography>
                    <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                      {formatDate(invoice.start_date)}
                    </Typography>
                  </div>
                )}
                {invoice.due_date && (
                  <div>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {t("resident.invoices.dueDate") || t("invoices.dueDate") || "Son tarix"}
                    </Typography>
                    <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                      {formatDate(invoice.due_date)}
                    </Typography>
                  </div>
                )}
                {invoice.paid_at && (
                  <div>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {t("invoices.paidAt") || "Ödəniş tarixi"}
                    </Typography>
                    <Typography variant="small" className="font-semibold text-green-600 dark:text-green-400">
                      {formatDateTime(invoice.paid_at)}
                    </Typography>
                  </div>
                )}
                {invoice.created_at && (
                  <div>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {t("properties.createdAt") || "Yaradılma tarixi"}
                    </Typography>
                    <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                      {formatDateTime(invoice.created_at)}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
              {t("resident.invoices.noData") || "Məlumat yoxdur"}
            </Typography>
          </div>
        )}
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <Button
          variant="text"
          color="gray"
          onClick={onClose}
          className="mr-2"
        >
          {t("buttons.close") || "Bağla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

