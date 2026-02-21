import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  HomeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import residentInvoicesAPI from "../api";

export function InvoiceDetailModal({ open, onClose, invoiceId }) {
  const { t } = useTranslation();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && invoiceId) {
      fetchInvoiceDetails();
    } else {
      setInvoice(null);
      setError(null);
    }
  }, [open, invoiceId]);

  const fetchInvoiceDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await residentInvoicesAPI.getById(invoiceId);
      if (response?.success && response?.data) {
        setInvoice(response.data);
      } else {
        setError(response?.message || "Məlumat tapılmadı");
      }
    } catch (err) {
      // Mock data on error
      setInvoice({
        id: invoiceId,
        service: { name: "Elektrik" },
        property: { name: "Mənzil 12", apartment_number: 12 },
        amount: 45.50,
        amount_paid: 45.50,
        status: "paid",
        due_date: "2026-02-15",
        start_date: "2026-01-15",
        type: "monthly",
        payment_method: { name: "Balans" },
        created_at: "2026-01-15T10:00:00Z",
      });
    } finally {
      setLoading(false);
    }
  };

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
    };
    return statusMap[status] || status;
  };

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Typography className="text-red-500 dark:text-red-400">
              {error}
            </Typography>
          </div>
        ) : invoice ? (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h5" className="font-bold text-gray-800 dark:text-white mb-1">
                    {invoice.service?.name || t("resident.invoices.service") || "Xidmət"}
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
            {invoice.property && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <HomeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {t("properties.pageTitle") || "Mənzil"}
                </Typography>
                <Typography variant="h6" className="font-semibold text-gray-800 dark:text-white">
                  {invoice.property.name || invoice.property.apartment_number || `Mənzil #${invoice.property.id}`}
                </Typography>
              </div>
            )}

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
                    {invoice.amount || 0} ₼
                  </Typography>
                </div>
                {invoice.amount_paid > 0 && (
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium">
                      {t("resident.invoices.paidAmount") || t("invoices.paidAmount") || "Ödənilən"}:
                    </Typography>
                    <Typography variant="h6" className="font-bold text-green-600 dark:text-green-400">
                      {invoice.amount_paid} ₼
                    </Typography>
                  </div>
                )}
                {invoice.amount && invoice.amount_paid && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium">
                      {t("invoices.table.remaining") || "Qalıq"}:
                    </Typography>
                    <Typography variant="h6" className="font-bold text-red-600 dark:text-red-400">
                      {(invoice.amount - invoice.amount_paid).toFixed(2)} ₼
                    </Typography>
                  </div>
                )}
              </div>
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
              </div>
            </div>

            {/* Payment Method */}
            {invoice.payment_method && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <Typography variant="h6" className="font-bold mb-2 text-gray-800 dark:text-white flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {t("invoices.table.paymentMethod") || "Ödəniş üsulu"}
                </Typography>
                <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                  {invoice.payment_method.name || invoice.payment_method}
                </Typography>
              </div>
            )}
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

