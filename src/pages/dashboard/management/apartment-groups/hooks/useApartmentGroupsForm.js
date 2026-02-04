import { useState } from "react";

const initialFormState = {
  name: "",
  complex: "",
  building: "",
  total: "",
  occupied: "",
  serviceFee: "",
};

export function useApartmentGroupsForm() {
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

  const setFormFromGroup = (group) => {
    if (group) {
      setFormData({
        name: group.name || "",
        complex: group.complex || "",
        building: group.building || "",
        total: String(group.total || ""),
        occupied: String(group.occupied || ""),
        serviceFee: String(group.serviceFee || ""),
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromGroup,
  };
}

