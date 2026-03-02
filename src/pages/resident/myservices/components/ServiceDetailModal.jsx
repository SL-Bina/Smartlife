import React from "react";
import { Dialog, DialogBody, Typography } from "@material-tailwind/react";
import {
  XMarkIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { useComplexColor } from "@/hooks/useComplexColor";

const STATUS_CFG = {
  active:    { label: "Aktiv",       cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",     icon: CheckCircleSolid },
  pending:   { label: "Gözləmədə",   cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: ClockIcon },
  cancelled: { label: "Ləğv edilib", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",            icon: XCircleIcon },
};

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        {label}
      </div>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right max-w-[60%]">{value || "-"}</span>
    </div>
  );
}

const fmtDate = (d) => {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString("az-AZ", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return d; }
};

export function ServiceDetailModal({ service, open, onClose }) {
  const { color, getRgba } = useComplexColor();
  if (!service) return null;

  const st = STATUS_CFG[service.status] || { label: service.status || "-", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300", icon: null };
  const StIcon = st.icon;
  const price = service.price || service.amount;

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 !max-w-lg">
      {/* ── Compact gradient header ── */}
      <div
        className="flex items-center justify-between px-5 py-4 rounded-t-xl"
        style={{ background: `linear-gradient(135deg, ${color}, ${getRgba(0.75)})` }}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <WrenchScrewdriverIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Xidmət Detalları</p>
            <p className="text-white/70 text-xs">#{service.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <DialogBody className="p-5 space-y-4">
        {/* Service name + status banner */}
        <div
          className="rounded-xl p-4 flex items-center justify-between gap-3"
          style={{ background: getRgba(0.06), border: `1px solid ${getRgba(0.15)}` }}
        >
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-base truncate">{service.name || "Xidmət"}</p>
            {service.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{service.description}</p>
            )}
          </div>
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${st.cls}`}>
            {StIcon && <StIcon className="h-3.5 w-3.5" />}
            {st.label}
          </span>
        </div>

        {/* Stat mini-cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50 text-center">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Qiymət</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
              {price ? `${price}` : "—"}
            </p>
            {price && <p className="text-[10px] text-gray-400">AZN</p>}
          </div>
          <div className="rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50 text-center">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Status</p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${st.cls}`}>
              {StIcon && <StIcon className="h-3 w-3" />}
              {st.label}
            </span>
          </div>
        </div>

        {/* Detail rows */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl px-4 py-1">
          <Row icon={CalendarIcon}      label="Başlanğıc tarixi"  value={fmtDate(service.start_date)} />
          <Row icon={CalendarIcon}      label="Növbəti ödəniş"    value={fmtDate(service.next_date)} />
          <Row icon={CalendarIcon}      label="Son ödəniş tarixi" value={fmtDate(service.last_date)} />
          {service.description && (
            <Row icon={InformationCircleIcon} label="Təsvir" value={service.description} />
          )}
        </div>

        {/* Footer close button */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Bağla
          </button>
        </div>
      </DialogBody>
    </Dialog>
  );
}

// Keep default export alias for backward compatibility
export default ServiceDetailModal;
