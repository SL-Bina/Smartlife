import { useState } from "react";

export function useApplicationsListFilters() {
  const [filters, setFilters] = useState({
    searchText: "",
    apartment: "",
    department: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    plannedDateFrom: "",
    plannedDateTo: "",
    employeePriority: "",
    residentPriority: "",
    category: "",
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
      searchText: "",
      apartment: "",
      department: "",
      status: "",
      dateFrom: "",
      dateTo: "",
      plannedDateFrom: "",
      plannedDateTo: "",
      employeePriority: "",
      residentPriority: "",
      category: "",
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

