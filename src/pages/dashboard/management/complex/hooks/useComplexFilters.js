import { useState } from "react";

export function useComplexFilters() {
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    status: "",
    email: "",
    phone: "",
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
      name: "",
      address: "",
      status: "",
      email: "",
      phone: "",
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

