import { useState } from "react";

const emptyForm = {
  mtk_id: null,
  complex_id: null,
  name: "",
  status: "active",
  meta: {
    desc: "",
  },
};

export function useBuildingForm() {
  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => setFormData(emptyForm);

  const updateField = (key, value) => setFormData((p) => ({ ...p, [key]: value }));
  const updateMeta = (key, value) => setFormData((p) => ({ ...p, meta: { ...p.meta, [key]: value } }));

  const setFormFromBuilding = (item) => {
    const complex = item?.complex || null;
    const mtkId = complex?.bind_mtk?.id ?? complex?.mtk_id ?? item?.mtk_id ?? null;

    setFormData({
      mtk_id: mtkId,
      complex_id: complex?.id ?? item?.complex_id ?? null,
      name: item?.name || "",
      status: item?.status || "active",
      meta: {
        desc: item?.meta?.desc || "",
      },
    });
  };

  return { formData, resetForm, updateField, updateMeta, setFormFromBuilding };
}
