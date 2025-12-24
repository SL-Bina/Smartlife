import { useState } from "react";

const initialFormState = {
  payer: "",
  amount: "",
};

export function usePaymentHistoryForm() {
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

  const setFormFromPayment = (payment) => {
    if (payment) {
      setFormData({
        payer: payment.payer || "",
        amount: payment.amount || "",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromPayment,
  };
}

