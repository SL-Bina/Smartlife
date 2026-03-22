export function buildInvoicePayload(formData) {
  const toNumberOrNull = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const toAmount = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const normalizeDate = (value) => {
    if (!value) return "";
    const str = String(value).trim();
    return str.length >= 10 ? str.slice(0, 10) : str;
  };

  const allowedTypes = new Set(["daily", "monthly", "yearly", "one_time", "weekly", "quarterly", "biannually"]);
  const allowedStatuses = new Set(["pending", "pre_paid", "paid", "overdue", "declined", "unpaid", "draft"]);

  const normalizedType = allowedTypes.has(formData?.type) ? formData.type : "one_time";
  const rawStatus = formData?.status === "not_paid" ? "unpaid" : formData?.status;
  const normalizedStatus = allowedStatuses.has(rawStatus) ? rawStatus : "unpaid";

  return {
    property_id: toNumberOrNull(formData?.property_id),
    amount: toAmount(formData?.amount),
    start_date: normalizeDate(formData?.start_date),
    due_date: normalizeDate(formData?.due_date),
    type: normalizedType,
    status: normalizedStatus,
    service_id: toNumberOrNull(formData?.service_id),
    meta: {
      desc: (formData?.meta?.desc ?? "").toString().trim(),
    },
  };
}
