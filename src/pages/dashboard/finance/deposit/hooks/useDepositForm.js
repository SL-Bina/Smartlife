import { useState } from "react";

const initialFormState = {
  apartment: "",
  owner: "",
  amount: "",
  paymentMethod: "",
  depositDate: "",
  notes: "",
};

export function useDepositForm() {
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

  const setFormFromDeposit = (deposit) => {
    if (deposit) {
      setFormData({
        apartment: deposit.apartment || "",
        owner: deposit.owner || "",
        amount: deposit.amount || "",
        paymentMethod: deposit.paymentMethod || "",
        depositDate: deposit.depositDate || "",
        notes: deposit.notes || "",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromDeposit,
  };
}

