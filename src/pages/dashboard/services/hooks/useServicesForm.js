import { useState } from "react";

export const initialFormState = {
  name: "",
  description: "",
  price: "",
};

export function useServicesForm() {
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

  const setFormFromService = (service) => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        price: service.price || "",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromService,
  };
}

