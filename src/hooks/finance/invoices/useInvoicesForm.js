import { useState } from "react";

const initialFormState = {
  amount: "",
  start_date: "",
  due_date: "",
  building_id: null,
  building: null,
  block_id: null,
  block: null,
  property_id: null,
  property: null,
  service_id: null,
  type: "",
  status: "unpaid",
  meta: {
    desc: ""
  }
};

export function useInvoicesForm() {
  const [formData, setFormData] = useState(initialFormState);

  const updateField = (field, value) => {
    setFormData((prev) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const toDateOnly = (val) => {
    if (!val) return "";
    const s = typeof val === "string" ? val : String(val);
    return s.length >= 10 ? s.slice(0, 10) : s;
  };

  const setFormFromInvoice = (invoice) => {
    if (!invoice) return;
    const prop = invoice.property || invoice.apartment || null;
    const amount = invoice.amount != null ? String(invoice.amount) : "";
    const startDate = toDateOnly(invoice.start_date || invoice.dateStart || invoice.invoiceDate);
    const dueDate = toDateOnly(invoice.due_date || invoice.dateEnd);
    const propertyId = invoice.property_id ?? prop?.id ?? null;
    const serviceId = invoice.service_id ?? invoice.service?.id ?? null;
    const buildingId =
      invoice.building_id ??
      prop?.building_id ??
      prop?.building?.id ??
      invoice.building?.id ??
      null;
    const blockId =
      invoice.block_id ?? prop?.block_id ?? prop?.block?.id ?? invoice.block?.id ?? null;
    setFormData({
      amount,
      start_date: startDate,
      due_date: dueDate,
      building_id: buildingId,
      building: invoice.building || prop?.building || null,
      block_id: blockId,
      block: invoice.block || prop?.block || null,
      property_id: propertyId,
      property: prop,
      service_id: serviceId,
      type: invoice.type || "",
      status: invoice.status || "unpaid",
      meta: {
        desc: invoice.meta?.desc || "",
      },
    });
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromInvoice,
  };
}

