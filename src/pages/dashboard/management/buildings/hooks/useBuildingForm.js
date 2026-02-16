import { useState, useCallback } from "react";

const initialFormData = {
  name: "",
  complex_id: null,
  meta: {
    desc: "",
  },
  status: "active",
};

export function useBuildingForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    if (field.startsWith("meta.")) {
      const metaField = field.replace("meta.", "");
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const setFormFromBuilding = useCallback((building) => {
    if (!building) {
      resetForm();
      return;
    }

    setFormData({
      name: building.name || "",
      complex_id: building.complex?.id || building.complex_id || null,
      meta: {
        desc: building.meta?.desc || "",
      },
      status: building.status || "active",
    });
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  const setFormErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  return {
    formData,
    errors,
    updateField,
    setFormFromBuilding,
    resetForm,
    setFormErrors,
  };
}

