import { useState } from "react";

export function useBuildingsFilters() {
  const [filters, setFilters] = useState({
    name: "",
    complex: "",
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
      complex: "",
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

