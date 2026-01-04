import { useState } from "react";

const initialFormState = {
  name: "",
  status: "active",
  complex_id: null,
  complex: null,
  meta: {
    desc: "",
  },
};

export function useBuildingsForm() {
  const [formData, setFormData] = useState(initialFormState);

  const updateField = (field, value) => {
    if (field.startsWith("meta.")) {
      const metaField = field.replace("meta.", "");
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: value,
        },
      }));
    } else if (field === "complex" || field === "complex_id") {
      setFormData((prev) => ({
        ...prev,
        complex: typeof value === "object" ? value : prev.complex,
        complex_id: typeof value === "object" ? value?.id : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const setFormFromBuilding = (building) => {
    if (building) {
      setFormData({
        name: building.name || "",
        status: building.status || "active",
        complex_id: building.complex?.id || null,
        complex: building.complex || null,
        meta: {
          desc: building.meta?.desc || "",
        },
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

