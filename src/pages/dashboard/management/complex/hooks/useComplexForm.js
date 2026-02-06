import { useState } from "react";

const emptyForm = {
  name: "",
  status: "active",
  mtk_id: null,
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
  modules: [1, 2],
  avaliable_modules: [1, 2],
};

export function useComplexForm() {
  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => setFormData(emptyForm);

  const updateField = (key, value) => setFormData((p) => ({ ...p, [key]: value }));
  const updateMeta = (key, value) => setFormData((p) => ({ ...p, meta: { ...p.meta, [key]: value } }));

  const setFormFromComplex = (item) => {
    setFormData({
      name: item?.name || "",
      status: item?.status || "active",
      mtk_id: item?.mtk_id ?? item?.bind_mtk?.id ?? null,
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
      modules: Array.isArray(item?.modules) ? item.modules : [1, 2],
      avaliable_modules: Array.isArray(item?.avaliable_modules) ? item.avaliable_modules : [1, 2],
    });
  };

  return { formData, resetForm, updateField, updateMeta, setFormFromComplex };
}
