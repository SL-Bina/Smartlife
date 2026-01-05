import { useState } from "react";

export function usePaymentHistoryFilters() {
  const [filters, setFilters] = useState({
    payer: "",
    amount: "",
    startDate: "",
    endDate: "",
    status: "",
    transactionType: "",
    building: "",
    block: "",
    apartment: "",
    paymentType: "",
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      payer: "",
      amount: "",
      startDate: "",
      endDate: "",
      status: "",
      transactionType: "",
      building: "",
      block: "",
      apartment: "",
      paymentType: "",
    });
  };

  const applyFilters = () => {
    setFilterOpen(false);
  };

  return {
    filters,
    filterOpen,
    setFilterOpen,
    updateFilter,
    clearFilters,
    applyFilters,
  };
}

