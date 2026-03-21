const TRUE_VALUES = new Set([true, 1, "1", "true", "active", "enabled", "open", "on"]);
const FALSE_VALUES = new Set([false, 0, "0", "false", "inactive", "disabled", "closed", "off"]);

const PREPAID_PATHS = [
  ["pre_paid"],
  ["config", "pre_paid"],
];

function getByPath(source, path) {
  return path.reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), source);
}

export function normalizePaymentFlag(value) {
  if (value === null || value === undefined) return null;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (TRUE_VALUES.has(normalized)) return true;
    if (FALSE_VALUES.has(normalized)) return false;
    return null;
  }

  if (TRUE_VALUES.has(value)) return true;
  if (FALSE_VALUES.has(value)) return false;
  return null;
}

export function resolveComplexPrePaidEnabled(source) {
  if (!source || typeof source !== "object") return null;

  for (const path of PREPAID_PATHS) {
    const normalized = normalizePaymentFlag(getByPath(source, path));
    if (normalized !== null) {
      return normalized;
    }
  }

  const nestedCandidates = [
    source.config,
    source.complex,
    source.sub_data?.complex,
    source.property?.complex,
    source.property?.sub_data?.complex,
    source.apartment?.complex,
  ];

  for (const candidate of nestedCandidates) {
    const resolved = resolveComplexPrePaidEnabled(candidate);
    if (resolved !== null) {
      return resolved;
    }
  }

  return null;
}

export function getInvoiceComplexId(invoice) {
  return (
    invoice?.complex_id ??
    invoice?.property?.complex_id ??
    invoice?.property?.complex?.id ??
    invoice?.property?.sub_data?.complex?.id ??
    invoice?.apartment?.complex_id ??
    invoice?.apartment?.complex?.id ??
    null
  );
}