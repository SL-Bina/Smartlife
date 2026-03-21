import { useState, useMemo } from "react";

// ─── UI state shape ────────────────────────────────────────────────────────────
export const EMPTY_FILTERS = {
  invoiceId:       "",   // → invoice_id
  status:          "",   // → status
  type:            "",   // → type
  serviceIds:      [],   // → service_ids[]
  propertyIds:     [],   // → property_ids[]
  paidAtFrom:      "",   // ─┐ → paid_at=from_to
  paidAtTo:        "",   // ─┘
  amountFrom:      "",   // ─┐ → amount=from_to
  amountTo:        "",   // ─┘
  amountPaidFrom:  "",   // ─┐ → amount_paid=from_to
  amountPaidTo:    "",   // ─┘
};

// ─── UI → API param mapping ────────────────────────────────────────────────────
// Yalnız BU funksiyada backend param adlarını dəyiş.
export const toApiParams = (f = {}) => {
  const p = {};

  if (f.invoiceId)                    p.invoice_id          = f.invoiceId;
  if (f.status)                       p.status              = f.status;
  if (f.type)                         p.type                = f.type;
  if (f.serviceIds?.length)           p["service_ids[]"]    = f.serviceIds;
  if (f.propertyIds?.length)          p["property_ids[]"]   = f.propertyIds;
  if (f.paidAtFrom && f.paidAtTo)     p.paid_at             = `${f.paidAtFrom}_${f.paidAtTo}`;
  if (f.amountFrom  || f.amountTo)    p.amount              = `${f.amountFrom || ""}_${f.amountTo  || ""}`;
  if (f.amountPaidFrom || f.amountPaidTo) p.amount_paid     = `${f.amountPaidFrom || ""}_${f.amountPaidTo || ""}`;

  return p;
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useInvoicesFilters() {
  const [filters, setFilters]     = useState(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  // Search modal "Axtar" — yeni filter obyektini tam əvəz edir
  const applyFilters = (newFilters = {}) => {
    setFilters({ ...EMPTY_FILTERS, ...newFilters });
    setFilterOpen(false);
  };

  // Quick-filter kısayollar (ManagementActions)
  const applyStatus = (value) =>
    setFilters((prev) => ({ ...prev, status: value || "" }));

  const applyName = (value) =>
    setFilters((prev) => ({ ...prev, invoiceId: value || "" }));

  const removeFilter = (key) =>
    setFilters((prev) => ({ ...prev, [key]: Array.isArray(prev[key]) ? [] : "" }));

  // useMemo — hər renderdə yeni object yaratmır, yalnız filters dəyişəndə yenilənir
  const apiParams      = useMemo(() => toApiParams(filters), [filters]);
  const hasActiveFilters = Object.keys(apiParams).length > 0;

  return {
    filters,
    apiParams,
    hasActiveFilters,
    filterOpen,
    setFilterOpen,
    clearFilters,
    applyFilters,
    applyStatus,
    applyName,
    removeFilter,
  };
}


