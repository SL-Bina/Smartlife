import { useState } from "react";

const initialFormState = {
  number: "",
  block: "",
  floor: "",
  area: "",
  resident: "",
};

export function usePropertiesForm() {
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

  const setFormFromProperty = (property) => {
    if (property) {
      setFormData({
        number: property.number || "",
        block: property.block || "",
        floor: String(property.floor || ""),
        area: String(property.area || ""),
        resident: property.resident || "",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromProperty,
  };
}

