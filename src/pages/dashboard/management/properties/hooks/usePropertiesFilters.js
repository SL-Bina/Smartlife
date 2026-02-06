import { useState } from "react";

const v = (x) => (x === null || x === undefined ? "" : String(x));

export function usePropertiesFilters() {
  const [filterOpen, setFilterOpen] = useState(false);

  // ✅ burda hamısı olmalıdır
  const [filters, setFilters] = useState({
    number: "",
    block: "",

    // lookups
    mtk_id: "",
    complex_id: "",
    building_id: "",
    block_id: "",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const updateFilter = (key, value) => {
    const nextValue = v(value);

    setFilters((prev) => {
      const next = { ...prev, [key]: nextValue };

      // ✅ lookup select-lər dərhal tətbiq olunsun
      if (["mtk_id", "complex_id", "building_id", "block_id"].includes(key)) {
        setAppliedFilters(next);
      }

      return next;
    });
  };

  const clearFilters = () => {
    const cleared = {
      number: "",
      block: "",
      mtk_id: "",
      complex_id: "",
      building_id: "",
      block_id: "",
    };
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
