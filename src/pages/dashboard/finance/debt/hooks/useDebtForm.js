import { useState } from "react";

const initialFormState = {
  creditor: "",
  debtor: "",
  amount: "",
  debtDate: "",
  dueDate: "",
  description: "",
  category: "",
};

export function useDebtForm() {
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

  const setFormFromDebt = (debt) => {
    if (debt) {
      setFormData({
        creditor: debt.creditor || "",
        debtor: debt.debtor || "",
        amount: debt.amount || "",
        debtDate: debt.debtDate || "",
        dueDate: debt.dueDate || "",
        description: debt.description || "",
        category: debt.category || "",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromDebt,
  };
}

