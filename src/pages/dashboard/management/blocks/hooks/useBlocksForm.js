import { useState } from "react";

const initialFormState = {
  name: "",
  building: "",
  floors: "",
  apartments: "",
};

export function useBlocksForm() {
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

  const setFormFromBlock = (block) => {
    if (block) {
      setFormData({
        name: block.name || "",
        building: block.building || "",
        floors: String(block.floors || ""),
        apartments: String(block.apartments || ""),
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromBlock,
  };
}

