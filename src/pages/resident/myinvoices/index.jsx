import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Spinner, Chip, Button } from "@material-tailwind/react";
import {
  DocumentTextIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import residentInvoicesAPI from "./api";
import { InvoiceDetailModal } from "./components";

// Mock data
const mockInvoices = [
  {
    id: 1,
    service: { name: "Elektrik" },
    property: { name: "Mənzil 12", apartment_number: 12 },
    amount: 45.50,
    amount_paid: 45.50,
    status: "paid",
    due_date: "2026-02-15",
    start_date: "2026-01-15",
  },
  {
    id: 2,
    service: { name: "Su" },
    property: { name: "Mənzil 12", apartment_number: 12 },
    amount: 25.00,
    amount_paid: 0,
    status: "unpaid",
    due_date: "2026-02-20",
    start_date: "2026-01-20",
  },
  {
    id: 3,
    service: { name: "Qaz" },
    property: { name: "Mənzil 12", apartment_number: 12 },
    amount: 30.75,
    amount_paid: 15.00,
    status: "pending",
    due_date: "2026-02-25",
    start_date: "2026-01-25",
  },
  {
    id: 4,
    service: { name: "Təmizlik" },
    property: { name: "Mənzil 12", apartment_number: 12 },
    amount: 20.00,
    amount_paid: 0,
    status: "overdue",
    due_date: "2026-01-30",
    start_date: "2026-01-01",
  },
];

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
      const list = response?.data?.data ?? response?.data;
      const useMock = !response?.success && (!list || (Array.isArray(list) && list.length === 0));
      setInvoices(useMock ? mockInvoices : (list || mockInvoices));
    } catch (err) {
      setInvoices(mockInvoices);
      setError(null);
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
          {invoices.map((invoice, index) => (
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
                        {invoice.service?.name || t("resident.invoices.service") || t("invoices.service") || "Xidmət"}
                      </Typography>
                      {invoice.property && (
                        <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                          {invoice.property.name || invoice.property.apartment_number || `Mənzil #${invoice.property.id}`}
                        </Typography>
                      )}
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
                        {invoice.amount || 0} ₼
                      </Typography>
                    </div>
                    {invoice.amount_paid > 0 && (
                      <div className="flex items-center justify-between">
                        <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                          {t("resident.invoices.paidAmount") || t("invoices.paidAmount") || "Ödənilən"}:
                        </Typography>
                        <Typography variant="small" className="font-semibold text-green-600 dark:text-green-400">
                          {invoice.amount_paid} ₼
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
          ))}
        </div>
      )}

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoiceId={selectedInvoice?.id}
      />
    </div>
  );
};

export default ResidentMyInvaoicesPage;
