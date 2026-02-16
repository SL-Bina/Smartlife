import { useState, useCallback } from "react";

const initialFormData = {
  name: "",
  complex_id: null,
  building_id: null,
  meta: {
    total_floor: "",
    total_apartment: "",
  },
  status: null,
};

export function useBlockForm() {
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

  const setFormFromBlock = useCallback((block) => {
    if (!block) {
      resetForm();
      return;
    }

    setFormData({
      name: block.name || "",
      complex_id: block.complex?.id || block.complex_id || null,
      building_id: block.building?.id || block.building_id || null,
      meta: {
        total_floor: block.meta?.total_floor || "",
        total_apartment: block.meta?.total_apartment || "",
      },
      status: block.status || null,
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
    setFormFromBlock,
    resetForm,
    setFormErrors,
  };
}

