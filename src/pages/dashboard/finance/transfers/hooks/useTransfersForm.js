import { useState } from "react";

const initialFormState = {
  fromAccount: "",
  toAccount: "",
  amount: "",
  transferDate: "",
  description: "",
};

export function useTransfersForm() {
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

  const setFormFromTransfer = (transfer) => {
    if (transfer) {
      setFormData({
        fromAccount: transfer.fromAccount || "",
        toAccount: transfer.toAccount || "",
        amount: transfer.amount || "",
        transferDate: transfer.transferDate || "",
        description: transfer.description || "",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromTransfer,
  };
}

