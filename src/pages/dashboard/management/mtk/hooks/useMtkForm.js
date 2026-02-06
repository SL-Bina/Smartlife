import { useState } from "react";

const emptyForm = {
  name: "",
  status: "active",
  meta: {
    lat: "",
    lng: "",
    desc: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    color_code: "",
  },
};

export function useMtkForm() {
  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => setFormData(emptyForm);

  const updateField = (key, value) => setFormData((p) => ({ ...p, [key]: value }));
  const updateMeta = (key, value) => setFormData((p) => ({ ...p, meta: { ...p.meta, [key]: value } }));

  const setFormFromMtk = (item) => {
    setFormData({
      name: item?.name || "",
      status: item?.status || "active",
      meta: {
        lat: item?.meta?.lat || "",
        lng: item?.meta?.lng || "",
        desc: item?.meta?.desc || "",
        address: item?.meta?.address || "",
        phone: item?.meta?.phone || "",
        email: item?.meta?.email || "",
        website: item?.meta?.website || "",
        color_code: item?.meta?.color_code || "",
      },
    });
  };

  return { formData, resetForm, updateField, updateMeta, setFormFromMtk };
}
