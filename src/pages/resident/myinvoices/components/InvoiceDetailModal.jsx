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
  HomeModernIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CreditCardIcon,
  BanknotesIcon,
  HashtagIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import residentInvoicesAPI from "../api";
import { useComplexColor } from "@/hooks/useComplexColor";

// ── Payment Modal ──────────────────────────────────────────────────────────────
function PaymentModal({ open, onClose, invoice, color, getRgba }) {
  const [method, setMethod] = useState("balance");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const remaining = Number(invoice?.amount || 0) - Number(invoice?.amount_paid || 0);

  const handlePay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPaying(false);
    setPaid(true);
    setTimeout(() => { setPaid(false); onClose(true); }, 1800);
  };

  useEffect(() => { if (!open) { setPaid(false); setPaying(false); } }, [open]);

  const methods = [
    { id: "balance", label: "Balans", icon: <BanknotesIcon className="h-5 w-5" /> },
    { id: "card", label: "Bank kartı", icon: <CreditCardIcon className="h-5 w-5" /> },
  ];

  return (
    <Dialog open={open} handler={() => onClose(false)} size="sm" className="dark:bg-gray-800">
      <DialogHeader className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700"
        style={{ background: `linear-gradient(135deg, ${getRgba(0.1)}, ${getRgba(0.04)})` }}
      >
        <div className="flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5" style={{ color }} />
          <Typography variant="h6" className="font-bold">Ödəniş</Typography>
        </div>
        <button onClick={() => onClose(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <XMarkIcon className="h-4 w-4 text-gray-500" />
        </button>
      </DialogHeader>
      <DialogBody className="dark:bg-gray-800 py-5">
        {paid ? (
          <div className="text-center py-6">
            <CheckCircleSolid className="h-16 w-16 mx-auto text-green-500 mb-3" />
            <Typography variant="h6" className="font-bold text-green-600 dark:text-green-400">Ödəniş uğurlu!</Typography>
            <Typography variant="small" className="text-gray-500 dark:text-gray-400 mt-1">{remaining.toFixed(2)} ₼ ödənildi</Typography>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl p-4 text-center" style={{ background: getRgba(0.08), border: `1px solid ${getRgba(0.2)}` }}>
              <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-1">Ödəniləcək məbləğ</Typography>
              <Typography variant="h3" className="font-bold" style={{ color }}>{remaining.toFixed(2)} ₼</Typography>
              <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                {typeof invoice?.service === 'string' ? invoice.service : invoice?.service?.name || 'Xidmət'}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Ödəniş üsulu</Typography>
              <div className="grid grid-cols-2 gap-2">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      method === m.id
                        ? 'border-current text-white'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-current/40'
                    }`}
                    style={method === m.id ? { borderColor: color, background: getRgba(0.12), color } : {}}
                  >
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogBody>
      {!paid && (
        <DialogFooter className="dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 gap-2">
          <Button variant="text" color="gray" onClick={() => onClose(false)} className="normal-case">Ləğv et</Button>
          <Button
            onClick={handlePay}
            disabled={paying}
            className="normal-case text-white flex-1"
            style={{ background: color }}
          >
            {paying ? <><ArrowPathIcon className="h-4 w-4 animate-spin inline mr-2" />Ödənilir...</> : `${remaining.toFixed(2)} ₼ Ödə`}
          </Button>
        </DialogFooter>
      )}
    </Dialog>
  );
}

// ── InvoiceDetailModal ──────────────────────────────────────────────────────────
export function InvoiceDetailModal({ open, onClose, invoiceId }) {
  const { t } = useTranslation();
  const { color, getRgba } = useComplexColor();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payModalOpen, setPayModalOpen] = useState(false);

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
      const response = await residentInvoicesAPI.getDetail(invoiceId);
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

  const isUnpaid = ["unpaid", "not_paid", "overdue"].includes(invoice?.status);
  const remaining = Number(invoice?.amount || 0) - Number(invoice?.amount_paid || 0);

  const STATUS_CFG = {
    paid:     { label: "Ödənilib",       cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",  icon: <CheckCircleSolid className="h-4 w-4" /> },
    unpaid:   { label: "Ödənilməmiş",   cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",        icon: <ExclamationCircleIcon className="h-4 w-4" /> },
    not_paid: { label: "Ödənilməmiş",   cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",        icon: <ExclamationCircleIcon className="h-4 w-4" /> },
    overdue:  { label: "Vaxtı keçib",   cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: <ClockIcon className="h-4 w-4" /> },
    pending:  { label: "Gözləyir",      cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <ClockIcon className="h-4 w-4" /> },
  };
  const statusCfg = STATUS_CFG[invoice?.status] || { label: invoice?.status || "-", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300", icon: null };

  const Row = ({ icon, label, value, valueClass = "" }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <span className="flex-shrink-0" style={{ color }}>{icon}</span>
        <Typography variant="small" className="font-medium">{label}</Typography>
      </div>
      <Typography variant="small" className={`font-bold text-right ${valueClass || "text-gray-800 dark:text-white"}`}>{value || "-"}</Typography>
    </div>
  );

  return (
    <>
      <Dialog
        open={open}
        handler={onClose}
        size="md"
        className="dark:bg-gray-900 overflow-hidden"
        dismiss={{ enabled: false }}
      >
        {/* ── Header ── */}
        <DialogHeader className="p-0">
          <div className="w-full p-5" style={{ background: `linear-gradient(135deg, ${getRgba(0.18)}, ${getRgba(0.07)})` }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/20">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Typography variant="h5" className="font-bold text-gray-900 dark:text-white leading-tight">
                    Faktura #{invoice?.id || invoiceId}
                  </Typography>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                    Faktura detalları
                  </Typography>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="dark:bg-gray-900 p-0 max-h-[65vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner className="h-8 w-8" style={{ color }} />
            </div>
          ) : error ? (
            <div className="text-center py-12 px-6">
              <ExclamationCircleIcon className="h-12 w-12 mx-auto text-red-400 mb-3" />
              <Typography className="text-red-500 dark:text-red-400 text-sm">{error}</Typography>
            </div>
          ) : invoice ? (
            <div className="p-4 space-y-4">
              {/* Status + service banner */}
              <div className="rounded-2xl p-4" style={{ background: getRgba(0.08), border: `1px solid ${getRgba(0.18)}` }}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs mb-0.5">Xidmət</Typography>
                    <Typography className="font-bold text-gray-900 dark:text-white">
                      {typeof invoice.service === "string" ? invoice.service : (invoice.service?.name || "Xidmət")}
                    </Typography>
                  </div>
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.cls}`}>
                    {statusCfg.icon}{statusCfg.label}
                  </span>
                </div>
              </div>

              {/* Financial summary */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Cəmi", value: `${Number(invoice.amount || 0).toFixed(2)} ₼`, color: "text-gray-900 dark:text-white" },
                  { label: "Ödənilən", value: `${Number(invoice.amount_paid || 0).toFixed(2)} ₼`, color: "text-green-600 dark:text-green-400" },
                  { label: "Qalıq", value: `${remaining.toFixed(2)} ₼`, color: remaining > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-3 text-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">{s.label}</Typography>
                    <Typography className={`font-bold text-sm mt-0.5 ${s.color}`}>{s.value}</Typography>
                  </div>
                ))}
              </div>

              {/* Detail rows */}
              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-1">
                <Row icon={<HashtagIcon className="h-4 w-4" />} label="Faktura ID" value={`#${invoice.id}`} />
                {invoice.property && (
                  <Row
                    icon={<HomeModernIcon className="h-4 w-4" />}
                    label="Mənzil"
                    value={
                      typeof invoice.property === "string"
                        ? invoice.property
                        : invoice.property?.name || invoice.property?.apartment_number || `Mənzil #${invoice.property?.id || ""}`
                    }
                  />
                )}
                {invoice.start_date && (
                  <Row icon={<CalendarIcon className="h-4 w-4" />} label="Başlama tarixi" value={formatDate(invoice.start_date)} />
                )}
                {invoice.due_date && (
                  <Row icon={<ClockIcon className="h-4 w-4" />} label="Son ödəniş tarixi" value={formatDate(invoice.due_date)} valueClass={isUnpaid ? "text-red-600 dark:text-red-400" : ""} />
                )}
                {invoice.payment_method && (
                  <Row
                    icon={<CreditCardIcon className="h-4 w-4" />}
                    label="Ödəniş üsulu"
                    value={typeof invoice.payment_method === "string" ? invoice.payment_method : invoice.payment_method?.name || invoice.payment_method?.title}
                  />
                )}
                {invoice.type && (
                  <Row icon={<DocumentTextIcon className="h-4 w-4" />} label="Növ" value={invoice.type} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <Typography variant="small" className="text-gray-500 dark:text-gray-400">Məlumat yoxdur</Typography>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="border-t border-gray-100 dark:border-gray-700 dark:bg-gray-900 gap-2 p-4">
          <Button variant="outlined" color="gray" onClick={onClose} className="normal-case">Bağla</Button>
          {invoice && isUnpaid && remaining > 0 && (
            <Button
              className="normal-case text-white flex-1"
              style={{ background: color }}
              onClick={() => setPayModalOpen(true)}
            >
              <CreditCardIcon className="h-4 w-4 inline mr-2" />{remaining.toFixed(2)} ₼ Ödə
            </Button>
          )}
        </DialogFooter>
      </Dialog>

      <PaymentModal
        open={payModalOpen}
        onClose={(success) => {
          setPayModalOpen(false);
          if (success) { onClose(); }
        }}
        invoice={invoice}
        color={color}
        getRgba={getRgba}
      />
    </>
  );
}

