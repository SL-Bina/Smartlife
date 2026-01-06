import { useState } from "react";

export function useExpensesFilters() {
  const [filters, setFilters] = useState({
    category: "",
    title: "",
    amountMin: "",
    amountMax: "",
    startDate: "",
    endDate: "",
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
      category: "",
      title: "",
      amountMin: "",
      amountMax: "",
      startDate: "",
      endDate: "",
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

