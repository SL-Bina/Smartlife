import { useState } from "react";

const initialFormState = {
  name: "",
};

export function useMtkForm() {
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

  const setFormFromMtk = (mtk) => {
    if (mtk) {
      setFormData({
        name: mtk.name || "",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromMtk,
  };
}

