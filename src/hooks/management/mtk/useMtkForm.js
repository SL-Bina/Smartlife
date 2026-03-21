import { useState, useCallback } from "react";

const initialFormData = {
  name: "",
  meta: {
    lat: "",
    lng: "",
    desc: "",
    address: "",
    color_code: "#dc2626",
    phone: "",
    email: "",
    website: "",
    logo: "",
    images: [],
  },
  status: "active",
};

export function useMtkForm() {
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

  const setFormFromMtk = useCallback((mtk) => {
    if (!mtk) {
      resetForm();
      return;
    }

    setFormData({
      name: mtk.name || "",
      meta: {
        lat: mtk.meta?.lat || "",
        lng: mtk.meta?.lng || "",
        desc: mtk.meta?.desc || "",
        address: mtk.meta?.address || "",
        color_code: mtk.meta?.color_code || "#3b82f6",
        phone: mtk.meta?.phone || "",
        email: mtk.meta?.email || "",
        website: mtk.meta?.website || "",
        logo: mtk.meta?.logo || "",
        images: Array.isArray(mtk.meta?.images) ? mtk.meta.images : (mtk.meta?.image ? [mtk.meta.image] : []),
      },
      status: mtk.status || "active",
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
    setFormFromMtk,
    resetForm,
    setFormErrors,
  };
}

