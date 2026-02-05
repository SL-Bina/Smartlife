import { useState } from "react";

const initialForm = {
  id: null,
  mtk_id: "",
  complex_id: "",
  building_id: "",
  block_id: "",
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
  const [formData, setFormData] = useState(initialForm);

  const resetForm = () => setFormData(initialForm);

  const updateField = (path, value) => {
    if (!path.includes(".")) {
      setFormData((prev) => ({ ...prev, [path]: value }));
      return;
    }
    const [root, key] = path.split(".");
    setFormData((prev) => ({
      ...prev,
      [root]: {
        ...(prev[root] || {}),
        [key]: value,
      },
    }));
  };

  const setFormFromProperty = (item) => {
    setFormData({
      id: item.id,
      mtk_id: item.mtk_id || item.sub_data?.mtk?.id || "",
      complex_id: item.complex_id || item.sub_data?.complex?.id || "",
      building_id: item.building_id || item.sub_data?.building?.id || "",
      block_id: item.block_id || item.sub_data?.block?.id || "",
      name: item.name || "",
      meta: {
        apartment_number: item.meta?.apartment_number ?? "",
        floor: item.meta?.floor ?? "",
        area: item.meta?.area ?? "",
      },
      property_type: item.property_type ?? 1,
      status: item.status || "active",
    });
  };

  return { formData, updateField, resetForm, setFormFromProperty, setFormData };
}
