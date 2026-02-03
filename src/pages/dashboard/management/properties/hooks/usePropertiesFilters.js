import { useState } from "react";

export function usePropertiesFilters() {
  const [filterOpen, setFilterOpen] = useState(false);

  // UI filter fields (istədiyin kimi artırarsan)
  const [filters, setFilters] = useState({
    number: "", // apartment_number
    block: "",  // block name
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const cleared = { number: "", block: "" };
    setFilters(cleared);
    setAppliedFilters(cleared);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setFilterOpen(false);
  };

  return {
    filters,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    updateFilter,
    clearFilters,
    applyFilters,
  };
}
