import { useState } from "react";

export function usePaymentForm() {
  const [amount, setAmount] = useState("");

  const setAmountValue = (value) => {
    setAmount(value);
  };

  const resetForm = () => {
    setAmount("");
  };

  return {
    amount,
    setAmountValue,
    resetForm,
  };
}

