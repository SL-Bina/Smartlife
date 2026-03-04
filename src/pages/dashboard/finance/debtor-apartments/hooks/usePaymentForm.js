import { useState, useCallback } from "react";
import { fetchPaymentMethods } from "../api";

export function usePaymentForm() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Payment methods from API
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [methodsLoading, setMethodsLoading] = useState(false);

  const loadPaymentMethods = useCallback(async () => {
    if (paymentMethods.length > 0) return; // already loaded
    try {
      setMethodsLoading(true);
      const methods = await fetchPaymentMethods();
      setPaymentMethods(methods);
      // auto-select first method if none selected
      if (methods.length > 0) {
        setPaymentMethodId(methods[0].id);
      }
    } catch (err) {
      console.error("Failed to load payment methods:", err);
    } finally {
      setMethodsLoading(false);
    }
  }, [paymentMethods.length]);

  const setAmountValue = (value) => {
    setAmount(value);
  };

  const setPaymentField = (key, value) => {
    if (key === "note") setNote(value);
    if (key === "paymentMethodId") setPaymentMethodId(value);
    if (key === "paymentDate") setPaymentDate(value);
  };

  const resetForm = () => {
    setAmount("");
    setNote("");
    setPaymentMethodId(paymentMethods.length > 0 ? paymentMethods[0].id : null);
    const today = new Date();
    setPaymentDate(today.toISOString().split("T")[0]);
  };

  return {
    amount,
    setAmountValue,
    note,
    paymentMethodId,
    paymentDate,
    paymentMethods,
    methodsLoading,
    loadPaymentMethods,
    setPaymentField,
    resetForm,
  };
}

