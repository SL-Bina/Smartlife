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

  const setFormFromInvoice = (invoice) => {
    if (invoice) {
      setFormData({
        title: invoice.title || invoice.serviceName || "",
        amount: invoice.amount || "",
        dateStart: invoice.dateStart || invoice.invoiceDate || "",
        dateEnd: invoice.dateEnd || "",
        building_id: invoice.building_id || invoice.building?.id || null,
        building: invoice.building || null,
        block_id: invoice.block_id || invoice.block?.id || null,
        block: invoice.block || null,
        floor: invoice.floor || "",
        apartment_id: invoice.apartment_id || invoice.apartment?.id || null,
        apartment: invoice.apartment || null,
        serviceName: invoice.serviceName || "",
        owner: invoice.owner || "",
        apartment: invoice.apartment || "",
        building: invoice.building || "",
        block: invoice.block || "",
        area: invoice.area || "",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromInvoice,
  };
}

