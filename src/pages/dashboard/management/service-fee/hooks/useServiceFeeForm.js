import { useState, useEffect } from "react";

export function useServiceFeeForm(apartment) {
  const [feeValue, setFeeValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (apartment?.serviceFee !== undefined) {
      setFeeValue(String(apartment.serviceFee));
    }
  }, [apartment]);

  const updateFeeValue = (value) => {
    setFeeValue(value);
  };

  const resetForm = () => {
    if (apartment?.serviceFee !== undefined) {
      setFeeValue(String(apartment.serviceFee));
    }
  };

  return {
    feeValue,
    saving,
    setSaving,
    updateFeeValue,
    resetForm,
  };
}

