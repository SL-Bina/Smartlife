import { useState } from "react";

const initialFormState = {
  name: "",
  complex: "",
  blocks: "",
  apartments: "",
};

export function useBuildingsForm() {
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

  const setFormFromBuilding = (building) => {
    if (building) {
      setFormData({
        name: building.name || "",
        complex: building.complex || "",
        blocks: String(building.blocks || ""),
        apartments: String(building.apartments || ""),
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromBuilding,
  };
}

