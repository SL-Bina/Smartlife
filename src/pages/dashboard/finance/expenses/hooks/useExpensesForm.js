import { useState } from "react";

const initialFormState = {
  category: "",
  description: "",
  amount: "",
  paymentMethod: "",
  paymentDate: "",
  paidBy: "",
  invoiceNumber: "",
};

export function useExpensesForm() {
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

  const setFormFromExpense = (expense) => {
    if (expense) {
      setFormData({
        category: expense.category || "",
        description: expense.description || "",
        amount: expense.amount || "",
        paymentMethod: expense.paymentMethod || "",
        paymentDate: expense.paymentDate || "",
        paidBy: expense.paidBy || "",
        invoiceNumber: expense.invoiceNumber || "",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromExpense,
  };
}

