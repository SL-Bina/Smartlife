import { useState, useCallback } from "react";

const initialFormData = {
  name: "",
  mtk_id: null,
  meta: {
    lat: "",
    lng: "",
    desc: "",
    address: "",
    color_code: "#dc2626",
    phone: "",
    email: "",
    website: "",
  },
  modules: [],
  avaliable_modules: [],
  status: "active",
};

export function useComplexForm() {
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

  const setFormFromComplex = useCallback((complex) => {
    if (!complex) {
      resetForm();
      return;
    }

    setFormData({
      name: complex.name || "",
      mtk_id: complex.bind_mtk?.id || complex.mtk_id || null,
      meta: {
        lat: complex.meta?.lat || "",
        lng: complex.meta?.lng || "",
        desc: complex.meta?.desc || "",
        address: complex.meta?.address || "",
        color_code: complex.meta?.color_code || "#dc2626",
        phone: complex.meta?.phone || "",
        email: complex.meta?.email || "",
        website: complex.meta?.website || "",
      },
      modules: complex.modules || [],
      avaliable_modules: complex.avaliable_modules || [],
      status: complex.status || "active",
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
    setFormFromComplex,
    resetForm,
    setFormErrors,
  };
}

