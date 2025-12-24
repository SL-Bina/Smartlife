import { useState } from "react";

const initialFormState = {
  fullName: "",
  phone: "",
  email: "",
  apartment: "",
  status: "Aktiv",
};

export function useResidentsForm() {
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

  const setFormFromResident = (resident) => {
    if (resident) {
      setFormData({
        fullName: resident.fullName || "",
        phone: resident.phone || "",
        email: resident.email || "",
        apartment: resident.apartment || "",
        status: resident.status || "Aktiv",
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromResident,
  };
}

