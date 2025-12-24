import { useState } from "react";

const initialFormState = {
  serviceName: "",
  owner: "",
  apartment: "",
  building: "",
  block: "",
  floor: "",
  area: "",
  amount: "",
};

export function useInvoicesForm() {
  const [formData, setFormData] = useState(initialFormState);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const setFormFromInvoice = (invoice) => {
    if (invoice) {
      setFormData({
        serviceName: invoice.serviceName || "",
        owner: invoice.owner || "",
        apartment: invoice.apartment || "",
        building: invoice.building || "",
        block: invoice.block || "",
        floor: invoice.floor || "",
        area: invoice.area || "",
        amount: invoice.amount || "",
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

