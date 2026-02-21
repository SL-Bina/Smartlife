import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Spinner, Chip, Button } from "@material-tailwind/react";
import {
  DocumentTextIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import residentInvoicesAPI from "./api";
import { InvoiceDetailModal } from "./components";

const ResidentMyInvaoicesPage = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await residentInvoicesAPI.getAll();
      const list = response?.data?.data ?? response?.data ?? [];
      setInvoices(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || t("common.loadError") || "Məlumat yüklənərkən xəta baş verdi");
      setInvoices([]);
    } finally {
      setLoading(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const parseAmount = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" style={{ position: 'relative', zIndex: 0 }}>
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <Typography className="text-sm text-gray-500 dark:text-gray-400">
            {t("common.loading") || "Yüklənir..."}
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12" style={{ position: 'relative', zIndex: 0 }}>
        <Typography className="text-sm text-red-500 dark:text-red-400">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 dark:from-green-700 dark:to-green-900 p-4 sm:p-6 rounded-xl shadow-lg border border-green-500 dark:border-green-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <DocumentTextIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-white font-bold">
              {t("resident.invoices.pageTitle") || t("invoices.pageTitle") || "Fakturalar"}
            </Typography>
            <Typography variant="small" className="text-green-100 dark:text-green-200">
              {invoices.length} {t("resident.invoices.invoice") || t("invoices.invoice") || "faktura"}
            </Typography>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {!invoices || invoices.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <Typography className="text-lg text-gray-500 dark:text-gray-400 font-semibold mb-2">
            {t("resident.invoices.noInvoices") || t("invoices.noInvoices") || "Faktura tapılmadı"}
          </Typography>
          <Typography variant="small" className="text-gray-400 dark:text-gray-500">
            {t("resident.invoices.noInvoicesDesc") || t("invoices.noInvoicesDesc") || "Hələ heç bir fakturanız yoxdur"}
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {invoices.map((invoice, index) => {
            const amount = parseAmount(invoice.amount);
            const amountPaid = parseAmount(invoice.amount_paid);
            const remaining = amount - amountPaid;

            return (
              <motion.div
                key={invoice.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                  <CardBody className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-bold mb-1">
                          {invoice.service?.name || (t("resident.invoices.service") || "Xidmət") + ` #${invoice.service_id}`}
                        </Typography>
                        <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                          {invoice.property?.name || (t("properties.property") || "Əmlak") + ` #${invoice.property_id}`}
                        </Typography>
                      </div>
                      <Chip
                        value={getStatusLabel(invoice.status)}
                        color={getStatusColor(invoice.status)}
                        size="sm"
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                            {t("resident.invoices.amount") || t("invoices.amount") || "Məbləğ"}:
                          </Typography>
                        </div>
                        <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">
                          {amount.toFixed(2)} ₼
                        </Typography>
                      </div>
                      {amountPaid > 0 && (
                        <div className="flex items-center justify-between">
                          <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                            {t("resident.invoices.paidAmount") || t("invoices.paidAmount") || "Ödənilən"}:
                          </Typography>
                          <Typography variant="small" className="font-semibold text-green-600 dark:text-green-400">
                            {amountPaid.toFixed(2)} ₼
                          </Typography>
                        </div>
                      )}
                      {remaining > 0 && (
                        <div className="flex items-center justify-between">
                          <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                            {t("invoices.table.remaining") || "Qalıq"}:
                          </Typography>
                          <Typography variant="small" className="font-semibold text-red-600 dark:text-red-400">
                            {remaining.toFixed(2)} ₼
                          </Typography>
                        </div>
                      )}
                      {invoice.type && (
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                            {getTypeLabel(invoice.type)}
                          </Typography>
                        </div>
                      )}
                      {invoice.due_date && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                            {t("resident.invoices.dueDate") || t("invoices.dueDate") || "Son tarix"}: {formatDate(invoice.due_date)}
                          </Typography>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outlined"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setDetailModalOpen(true);
                      }}
                    >
                      <EyeIcon className="h-4 w-4" />
                      {t("resident.invoices.view") || t("invoices.view") || "Bax"}
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default ResidentMyInvaoicesPage;
