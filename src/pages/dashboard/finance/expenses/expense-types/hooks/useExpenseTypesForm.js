import { useState } from "react";

const initialFormState = {
  name: "",
  description: "",
};

export function useExpenseTypesForm() {
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

  const setFormFromExpenseType = (expenseType) => {
    if (expenseType) {
      setFormData({
        name: expenseType.name || "",
        description: expenseType.description || "",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromExpenseType,
  };
}

