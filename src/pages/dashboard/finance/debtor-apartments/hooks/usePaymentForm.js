import { useState } from "react";

export function usePaymentForm() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const setAmountValue = (value) => {
    setAmount(value);
  };

  const setPaymentField = (key, value) => {
    if (key === "note") setNote(value);
    if (key === "paymentMethod") setPaymentMethod(value);
    if (key === "paymentDate") setPaymentDate(value);
  };

  const resetForm = () => {
    setAmount("");
    setNote("");
    setPaymentMethod("cash");
    const today = new Date();
    setPaymentDate(today.toISOString().split("T")[0]);
  };

  return {
    amount,
    setAmountValue,
    note,
    paymentMethod,
    paymentDate,
    setPaymentField,
    resetForm,
  };
}

