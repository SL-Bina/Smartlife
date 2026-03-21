export function buildInvoicePayload(formData) {
  return {
    property_id: formData.property_id,
    service_id: formData.service_id,
    amount: parseFloat(formData.amount),
    start_date: formData.start_date,
    due_date: formData.due_date,
    type: formData.type,
    status: formData.status || "unpaid",
    ...(formData.meta?.desc && {
      meta: {
        desc: formData.meta.desc,
      },
    }),
  };
}
