import { useState, useCallback } from "react";

const initialFormData = {
  name: "",
  surname: "",
  father_name: "",
  type: "owner",
  email: "",
  phone: "",
  meta: {
    gender: "",
    personal_code: "",
    birth_date: "",
  },
  property: {
    mtk_id: null,
    complex_id: null,
    property_id: null,
  },
  bind_existing: false,
  status: "active",
};

export function useResidentForm() {
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
    } else if (field.startsWith("property.")) {
      const propertyField = field.replace("property.", "");
      setFormData((prev) => ({
        ...prev,
        property: {
          ...prev.property,
          [propertyField]: value,
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

  const setFormFromResident = useCallback((resident) => {
    if (!resident) {
      resetForm();
      return;
    }

    // Property binding comes from property_residents array (list API)
    // or from property object (direct assignment)
    const boundProp = resident.property_residents?.[0];

    setFormData({
      name: resident.name || "",
      surname: resident.surname || "",
      father_name: resident.father_name || resident.meta?.father_name || "",
      type: resident.type || "owner",
      email: resident.email || "",
      phone: resident.phone || "",
      meta: {
        gender: resident.meta?.gender || resident.gender || "",
        personal_code: resident.meta?.personal_code || resident.personal_code || "",
        birth_date: resident.meta?.birth_date || resident.birth_date || "",
      },
      property: {
        mtk_id: boundProp?.mtk_id || resident.property?.mtk_id || null,
        complex_id: boundProp?.complex_id || resident.property?.complex_id || null,
        property_id: boundProp?.property_id || resident.property?.property_id || null,
      },
      bind_existing: resident.bind_existing || false,
      status: resident.status || "active",
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
    setFormFromResident,
    resetForm,
    setFormErrors,
  };
}

