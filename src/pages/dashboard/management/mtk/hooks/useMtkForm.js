import { useState } from "react";

const initialFormState = {
  name: "",
  status: "active",
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

  const setFormFromMtk = (mtk) => {
    if (mtk) {
      setFormData({
        name: mtk.name || "",
        status: mtk.status || "active",
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
  };
}

