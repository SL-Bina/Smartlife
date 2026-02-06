import { useState } from "react";

export function useMtkFilters() {
  const [filters, setFilters] = useState({ name: "" });
  const [filterOpen, setFilterOpen] = useState(false);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({ name: "" });

  const applyFilters = () => setFilterOpen(false);

  return {
    filters,
    filterOpen,
    setFilterOpen,
    updateFilter,
    clearFilters,
    applyFilters,
  };
}
