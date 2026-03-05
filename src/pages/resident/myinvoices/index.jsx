import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Spinner } from "@material-tailwind/react";
import {
  DocumentTextIcon,
  EyeIcon,
  CalendarIcon,
  Squares2X2Icon,
  TableCellsIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import residentInvoicesAPI from "./api";
import { InvoiceDetailModal } from "./components";
import { useComplexColor } from "@/hooks/useComplexColor";



const ResidentMyInvaoicesPage = () => {
  const { t } = useTranslation();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const { color, getRgba, headerStyle } = useComplexColor();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "card" | "table"

  useEffect(() => { fetchInvoices(); }, [selectedPropertyId]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = selectedPropertyId
        ? await residentInvoicesAPI.getByProperty(selectedPropertyId)
        : await residentInvoicesAPI.getAll();
      const list = response?.data?.data ?? response?.data;
      setInvoices(Array.isArray(list) ? list : []);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (invoice) => { setSelectedInvoice(invoice); setDetailModalOpen(true); };

  const formatDate = (d) => {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("az-AZ", { year: "numeric", month: "short", day: "numeric" }); }
    catch { return d; }
  };

  const STATUSES = {
    paid:     { label: "Ödənilib",     cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",    icon: <CheckCircleIcon className="h-3.5 w-3.5" /> },
    unpaid:   { label: "Ödənilməmiş", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",            icon: <ExclamationCircleIcon className="h-3.5 w-3.5" /> },
    not_paid: { label: "Ödənilməmiş", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",            icon: <ExclamationCircleIcon className="h-3.5 w-3.5" /> },
    overdue:  { label: "Vaxtı keçib", cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: <ClockIcon className="h-3.5 w-3.5" /> },
    pending:  { label: "Gözləyir",    cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <ClockIcon className="h-3.5 w-3.5" /> },
  };
  const statusCfg = (s) => STATUSES[s] || { label: s || "-", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300", icon: null };
  const isUnpaid  = (s) => ["unpaid", "not_paid", "overdue"].includes(s);

  const unpaidCount = invoices.filter((i) => isUnpaid(i.status)).length;
  const totalDebt   = invoices.filter((i) => isUnpaid(i.status)).reduce((s, i) => s + Number(i.amount || 0) - Number(i.amount_paid || 0), 0);
  const paidCount   = invoices.filter((i) => i.status === "paid").length;

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse" style={{ position: "relative", zIndex: 0 }}>
        {/* Header */}
        <div className="h-[80px] rounded-xl bg-gray-200 dark:bg-gray-700" />
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl h-[76px] bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
        {/* Filter/toggle row */}
        <div className="h-10 w-48 rounded-xl bg-gray-200 dark:bg-gray-700" />
        {/* Invoice cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl p-4 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex gap-2">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" style={{ position: "relative", zIndex: 0 }}>
      {/* ── Header ── */}
      <div className="p-4 sm:p-6 rounded-xl shadow-lg border" style={headerStyle}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <DocumentTextIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-white font-bold">Fakturalar</Typography>
            <Typography variant="small" className="text-white/80">{invoices.length} faktura</Typography>
          </div>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Cəmi",         value: invoices.length,  cls: "text-gray-900 dark:text-white",        bg: getRgba(0.07) },
          { label: "Ödənilməmiş",  value: unpaidCount,      cls: "text-red-600 dark:text-red-400",       bg: "rgba(239,68,68,0.07)", extra: unpaidCount > 0 ? `${totalDebt.toFixed(2)} ₼ borc` : null },
          { label: "Ödənilib",     value: paidCount,        cls: "text-green-600 dark:text-green-400",   bg: "rgba(34,197,94,0.07)" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-3 text-center border dark:border-gray-700" style={{ background: s.bg, borderColor: getRgba(0.15) }}>
            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">{s.label}</Typography>
            <Typography className={`font-bold text-xl ${s.cls}`}>{s.value}</Typography>
            {s.extra && <Typography variant="small" className="text-red-500 text-xs">{s.extra}</Typography>}
          </div>
        ))}
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <DocumentTextIcon className="h-14 w-14 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <Typography className="font-semibold text-gray-500 dark:text-gray-400">Faktura tapılmadı</Typography>
          <Typography variant="small" className="text-gray-400 dark:text-gray-500">Hələ heç bir fakturanız yoxdur</Typography>
        </div>
      ) : (
        <>
          {/* ── View toggle ── */}
          <div className="flex items-center gap-2">
            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs font-medium whitespace-nowrap">Görünüş:</Typography>
            <div className="flex items-center rounded-xl border dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 p-0.5 gap-0.5">
              {[
                { id: "card",  Icon: Squares2X2Icon, label: "Kart" },
                { id: "table", Icon: TableCellsIcon,  label: "Cədvəl" },
              ].map(({ id, Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === id
                      ? "text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                  style={viewMode === id ? { background: color } : {}}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CARD VIEW ── */}
          {viewMode === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {invoices.map((invoice, index) => {
                const cfg      = statusCfg(invoice.status);
                const unpaid   = isUnpaid(invoice.status);
                const remaining = Number(invoice.amount || 0) - Number(invoice.amount_paid || 0);
                return (
                  <motion.div key={invoice.id || index} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.04 }}>
                    <Card className="border dark:bg-gray-800 hover:shadow-lg transition-shadow" style={{ borderColor: unpaid ? "rgba(239,68,68,0.3)" : getRgba(0.2) }}>
                      <CardBody className="p-4">
                        {/* top */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="min-w-0">
                            <Typography className="font-bold text-gray-900 dark:text-white text-sm truncate">
                              {invoice.service?.name || "Xidmət"}
                            </Typography>
                            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">#{invoice.id}</Typography>
                          </div>
                          <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.cls}`}>
                            {cfg.icon}{cfg.label}
                          </span>
                        </div>

                        {/* amounts */}
                        <div className="flex items-end justify-between mb-3">
                          <div>
                            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">Məbləğ</Typography>
                            <Typography className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                              {Number(invoice.amount || 0).toFixed(2)} ₼
                            </Typography>
                          </div>
                          {unpaid && remaining > 0 && (
                            <div className="text-right">
                              <Typography variant="small" className="text-red-500 text-xs">Qalıq borc</Typography>
                              <Typography className="font-bold text-red-600 dark:text-red-400 text-sm">{remaining.toFixed(2)} ₼</Typography>
                            </div>
                          )}
                        </div>

                        {/* due date */}
                        {invoice.due_date && (
                          <div className="flex items-center gap-1.5 mb-3">
                            <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">
                              Son tarix: <span className={unpaid ? "text-red-500 font-semibold" : "text-gray-600 dark:text-gray-300"}>{formatDate(invoice.due_date)}</span>
                            </Typography>
                          </div>
                        )}

                        {/* actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetail(invoice)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <EyeIcon className="h-3.5 w-3.5" /> Bax
                          </button>
                          {unpaid && remaining > 0 && (
                            <button
                              onClick={() => openDetail(invoice)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                              style={{ background: color }}
                            >
                              <CreditCardIcon className="h-3.5 w-3.5" /> Ödə
                            </button>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── TABLE VIEW ── */}
          {viewMode === "table" && (
            <div className="rounded-xl border dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: getRgba(0.08) }}>
                      {["#", "Xidmət", "Məbləğ", "Ödənilib", "Qalıq", "Son tarix", "Status", ""].map((h) => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice, i) => {
                      const cfg       = statusCfg(invoice.status);
                      const unpaid    = isUnpaid(invoice.status);
                      const remaining = Number(invoice.amount || 0) - Number(invoice.amount_paid || 0);
                      return (
                        <tr key={invoice.id || i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                          <td className="px-3 py-2.5 text-gray-400 dark:text-gray-500 text-xs">#{invoice.id}</td>
                          <td className="px-3 py-2.5">
                            <Typography variant="small" className="font-semibold text-gray-800 dark:text-white truncate max-w-[140px]">
                              {invoice.service?.name || "Xidmət"}
                            </Typography>
                          </td>
                          <td className="px-3 py-2.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            {Number(invoice.amount || 0).toFixed(2)} ₼
                          </td>
                          <td className="px-3 py-2.5 text-green-600 dark:text-green-400 font-medium whitespace-nowrap">
                            {Number(invoice.amount_paid || 0).toFixed(2)} ₼
                          </td>
                          <td className={`px-3 py-2.5 font-semibold whitespace-nowrap ${remaining > 0 ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500"}`}>
                            {remaining.toFixed(2)} ₼
                          </td>
                          <td className={`px-3 py-2.5 text-xs whitespace-nowrap ${unpaid ? "text-red-500 font-semibold" : "text-gray-500 dark:text-gray-400"}`}>
                            {formatDate(invoice.due_date)}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${cfg.cls}`}>
                              {cfg.icon}{cfg.label}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => openDetail(invoice)} title="Bax" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-gray-400">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              {unpaid && remaining > 0 && (
                                <button onClick={() => openDetail(invoice)} title="Ödə" className="p-1.5 rounded-lg text-white hover:opacity-80 transition-opacity" style={{ background: color }}>
                                  <CreditCardIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Detail Modal ── */}
      <InvoiceDetailModal
        open={detailModalOpen}
        onClose={() => { setDetailModalOpen(false); setSelectedInvoice(null); }}
        invoiceId={selectedInvoice?.id}
      />
    </div>
  );
};

export default ResidentMyInvaoicesPage;

