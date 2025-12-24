import { useState } from "react";

export function useReportsFilters() {
  const [filters, setFilters] = useState({
    startDate: "2025-11-01",
    endDate: "2025-11-20",
    currency: "AZN ilə",
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
      startDate: "2025-11-01",
      endDate: "2025-11-20",
      currency: "AZN ilə",
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

