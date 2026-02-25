import { useState, useCallback } from "react";

const initialFormData = {
  id: null, 
  name: "",
  mtk_id: null,
  complex_id: null,
  building_id: null,
  block_id: null,
  meta: {
    apartment_number: "",
    floor: "",
    area: "",
  },
  property_type: null,
  status: "active",
};

export function usePropertyForm() {
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

  setErrors((prev) => {
    if (!prev[field]) return prev;
    const newErrors = { ...prev };
    delete newErrors[field];
    return newErrors;
  });
}, []);

  const setFormFromProperty = useCallback((property) => {
    if (!property) {
      resetForm();
      return;
    }

    setFormData({
      id: property.id || null,
      name: property.name || "",
      mtk_id: property.sub_data?.mtk?.id || property.mtk_id || null,
      complex_id: property.sub_data?.complex?.id || property.complex_id || null,
      building_id: property.sub_data?.building?.id || property.building_id || null,
      block_id: property.sub_data?.block?.id || property.block_id || null,
      meta: {
        apartment_number: property.meta?.apartment_number || "",
        floor: property.meta?.floor || "",
        area: property.meta?.area || "",
      },
      property_type: property.property_type || null,
      status: property.status || "active",
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
    setFormFromProperty,
    resetForm,
    setFormErrors,
  };
}

