import { useState } from "react";

const initialFormState = {
  name: "",
  status: "active",
  logo: null,
  photos: [],
  meta: {
    lat: "",
    lng: "",
    desc: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    color_code: "",
  },
};

export function useMtkForm() {
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
    } else if (field === "photos") {
      // Photos is an array
      setFormData((prev) => ({
        ...prev,
        photos: Array.isArray(value) ? value : [...(prev.photos || []), value].filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const setFormFromMtk = (mtk) => {
    if (mtk) {
      setFormData({
        name: mtk.name || "",
        status: mtk.status || "active",
        logo: mtk.logo || null,
        photos: mtk.photos || [],
        meta: {
          lat: mtk.meta?.lat || "",
          lng: mtk.meta?.lng || "",
          desc: mtk.meta?.desc || "",
          email: mtk.meta?.email || "",
          phone: mtk.meta?.phone || "",
          address: mtk.meta?.address || "",
          website: mtk.meta?.website || "",
          color_code: mtk.meta?.color_code || "",
        },
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromMtk,
    removePhoto,
  };
}

