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
  modules: [],
  avaliable_modules: [],
  bind_mtk: null,
};

export function useComplexForm() {
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
    } else if (field === "modules" || field === "avaliable_modules") {
      setFormData((prev) => ({
        ...prev,
        [field]: Array.isArray(value) ? value : [],
      }));
    } else if (field === "bind_mtk") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
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

  const setFormFromComplex = (complex) => {
    if (complex) {
      setFormData({
        name: complex.name || "",
        status: complex.status || "active",
        meta: {
          lat: complex.meta?.lat || "",
          lng: complex.meta?.lng || "",
          desc: complex.meta?.desc || "",
          email: complex.meta?.email || "",
          phone: complex.meta?.phone || "",
          address: complex.meta?.address || "",
          website: complex.meta?.website || "",
          color_code: complex.meta?.color_code || "",
        },
        modules: complex.modules || [],
        avaliable_modules: complex.avaliable_modules || [],
        bind_mtk: complex.bind_mtk || null,
      });
    }
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormFromComplex,
  };
}

