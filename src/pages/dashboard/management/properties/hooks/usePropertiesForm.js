import { useState } from "react";

const emptyForm = {
  mtk_id: null,
  complex_id: null,
  building_id: null,
  block_id: null,
  name: "",
  meta: {
    apartment_number: "",
    floor: "",
    area: "",
  },
  property_type: 1,
  status: "active",
};

export function usePropertiesForm() {
  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => setFormData(emptyForm);

  const updateField = (key, value) => setFormData((p) => ({ ...p, [key]: value }));
  const updateMeta = (key, value) => setFormData((p) => ({ ...p, meta: { ...p.meta, [key]: value } }));

  const setFormFromProperty = (item) => {
    const block = item?.block || item?.sub_data?.block || null;
    const building = item?.building || item?.sub_data?.building || block?.building || null;
    const complex = item?.complex || item?.sub_data?.complex || building?.complex || null;
    const mtkId = complex?.bind_mtk?.id ?? complex?.mtk_id ?? item?.mtk_id ?? null;

    setFormData({
      mtk_id: mtkId,
      complex_id: complex?.id ?? item?.complex_id ?? null,
      building_id: building?.id ?? item?.building_id ?? null,
      block_id: block?.id ?? item?.block_id ?? null,
      name: item?.name || "",
      meta: {
        apartment_number: String(item?.meta?.apartment_number || ""),
        floor: String(item?.meta?.floor || ""),
        area: String(item?.meta?.area || ""),
      },
      property_type: item?.property_type ?? 1,
      status: item?.status || "active",
    });
  };

  return { formData, resetForm, updateField, updateMeta, setFormFromProperty };
}
