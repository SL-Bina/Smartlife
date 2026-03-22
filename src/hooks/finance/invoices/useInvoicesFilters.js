import { useState, useMemo } from "react";

// ─── UI state shape ────────────────────────────────────────────────────────────
export const EMPTY_FILTERS = {
  invoiceId:       "",   // → invoice_id
  status:          "",   // → status
  type:            "",   // → type
  complexId:       "",   // → complex_ids[]
  buildingId:      "",   // → building_ids[]
  blockId:         "",   // → block_ids[]
  propertyId:      "",   // → property_ids[]
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

  const toIdsArray = (value) => {
    if (Array.isArray(value)) {
      return value.filter((item) => item !== null && item !== undefined && item !== "");
    }
    if (value === null || value === undefined || value === "") {
      return [];
    }
    return [value];
  };

  if (f.invoiceId)                    p.invoice_id          = f.invoiceId;
  if (f.status)                       p.status              = f.status;
  if (f.type)                         p.type                = f.type;

  const serviceIds = toIdsArray(f.serviceIds);
  if (serviceIds.length)              p["service_ids[]"]    = serviceIds;

  const propertyIds = toIdsArray(f.propertyIds?.length ? f.propertyIds : f.propertyId);
  if (propertyIds.length)             p["property_ids[]"]   = propertyIds;

  const complexIds = toIdsArray(f.complexIds?.length ? f.complexIds : f.complexId);
  if (complexIds.length)              p["complex_ids[]"]    = complexIds;

  const buildingIds = toIdsArray(f.buildingIds?.length ? f.buildingIds : f.buildingId);
  if (buildingIds.length)             p["building_ids[]"]   = buildingIds;

  const blockIds = toIdsArray(f.blockIds?.length ? f.blockIds : f.blockId);
  if (blockIds.length)                p["block_ids[]"]      = blockIds;

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
    setFilters((prev) => {
      const next = { ...prev };

      const keyAliasMap = {
        invoice_id: "invoiceId",
        "complex_ids[]": "complexId",
        "building_ids[]": "buildingId",
        "block_ids[]": "blockId",
        "property_ids[]": "propertyId",
      };

      const normalizedKey = keyAliasMap[key] || key;

      const clearKey = (targetKey) => {
        if (!(targetKey in next)) return;
        next[targetKey] = Array.isArray(next[targetKey]) ? [] : "";
      };

      if (normalizedKey === "paid_at") {
        next.paidAtFrom = "";
        next.paidAtTo = "";
        return next;
      }

      if (normalizedKey === "amount") {
        next.amountFrom = "";
        next.amountTo = "";
        return next;
      }

      if (normalizedKey === "amount_paid") {
        next.amountPaidFrom = "";
        next.amountPaidTo = "";
        return next;
      }

      // Hierarchical cascade clear
      if (normalizedKey === "complexId") {
        clearKey("complexId");
        clearKey("buildingId");
        clearKey("blockId");
        clearKey("propertyId");
        clearKey("propertyIds");
        return next;
      }

      if (normalizedKey === "buildingId") {
        clearKey("buildingId");
        clearKey("blockId");
        clearKey("propertyId");
        clearKey("propertyIds");
        return next;
      }

      if (normalizedKey === "blockId") {
        clearKey("blockId");
        clearKey("propertyId");
        clearKey("propertyIds");
        return next;
      }

      if (normalizedKey === "propertyId") {
        clearKey("propertyId");
        clearKey("propertyIds");
        return next;
      }

      if (!(normalizedKey in next)) {
        return next;
      }

      clearKey(normalizedKey);
      return next;
    });

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


