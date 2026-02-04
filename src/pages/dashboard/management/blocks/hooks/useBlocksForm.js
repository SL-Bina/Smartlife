import { useState } from "react";

const initialFormState = {
  complex_id: "",
  building_id: "",
  name: "",
  meta: {
    total_floor: "",
    total_apartment: "",
  },
};


export function useBlocksForm() {
  const [formData, setFormData] = useState(initialFormState);

  const updateField = (field, value) => {
    if (field.startsWith("meta.")) {
      const metaKey = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaKey]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => setFormData(initialFormState);

  const setFormFromBlock = (block) => {
    if (!block) return;

    setFormData({
      name: block.name || "",
      complex_id: block.complex_id ?? block.complex?.id ?? block.raw?.complex?.id ?? "",
      building_id: block.building_id ?? block.building?.id ?? block.raw?.building?.id ?? "",
      meta: {
        total_floor: String(block.floors ?? block.meta?.total_floor ?? ""),
        total_apartment: String(block.apartments ?? block.meta?.total_apartment ?? ""),
      },
    });
  };

  return { formData, updateField, resetForm, setFormFromBlock };
}
