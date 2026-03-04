import { useState, useCallback } from "react";

const initialFormData = {
  name: "",
  building: "",
  apartment: "",
  status: "Onlayn",
};

export function useDeviceForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const updateField = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors]
  );

  const setFormFromDevice = useCallback((device) => {
    if (!device) {
      resetForm();
      return;
    }
    setFormData({
      name: device.nameLines?.[0]?.text || device.name || "",
      building: String(device.building ?? ""),
      apartment: device.apartment || "",
      status: device.userStatus || "Onlayn",
    });
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Ad tələb olunur";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  return {
    formData,
    errors,
    updateField,
    setFormFromDevice,
    resetForm,
    validate,
  };
}
