import { useState } from "react";

export function useKPIFilters() {
  const [filters, setFilters] = useState({
    employeeName: "",
    employeeSurname: "",
    department: "",
    dateFrom: "",
    dateTo: "",
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
      employeeName: "",
      employeeSurname: "",
      department: "",
      dateFrom: "",
      dateTo: "",
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

