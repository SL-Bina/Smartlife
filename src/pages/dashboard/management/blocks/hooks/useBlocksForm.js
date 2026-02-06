import { useState } from "react";

const emptyForm = {
  mtk_id: null,
  complex_id: null,
  building_id: null,
  name: "",
  meta: {
    total_floor: "",
    total_apartment: "",
  },
};

export function useBlocksForm() {
  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => setFormData(emptyForm);

  const updateField = (key, value) => setFormData((p) => ({ ...p, [key]: value }));
  const updateMeta = (key, value) => setFormData((p) => ({ ...p, meta: { ...p.meta, [key]: value } }));

  const setFormFromBlock = (item) => {
    const building = item?.building || item?.raw?.building || null;
    const complex = item?.complex || item?.raw?.complex || building?.complex || null;
    const mtkId = complex?.bind_mtk?.id ?? complex?.mtk_id ?? item?.mtk_id ?? null;

    setFormData({
      mtk_id: mtkId,
      complex_id: complex?.id ?? item?.complex_id ?? null,
      building_id: building?.id ?? item?.building_id ?? null,
      name: item?.name || "",
      meta: {
        total_floor: String(item?.meta?.total_floor || item?.floors || ""),
        total_apartment: String(item?.meta?.total_apartment || item?.apartments || ""),
      },
    });
  };

  return { formData, resetForm, updateField, updateMeta, setFormFromBlock };
}
