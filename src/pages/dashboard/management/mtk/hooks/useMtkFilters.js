import { useState } from "react";

export function useMtkFilters() {
  const [filters, setFilters] = useState({ 
    status: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    color: ""
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({ 
    status: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    color: ""
  });

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
