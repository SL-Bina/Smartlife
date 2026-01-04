import { useState } from "react";

export function useInvoicesFilters() {
  const [filters, setFilters] = useState({
    serviceName: "",
    dateStart: "",
    dateEnd: "",
    paymentDateStart: "",
    paymentDateEnd: "",
    building: "",
    block: "",
    apartment: "",
    floor: "",
    status: "",
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
      serviceName: "",
      dateStart: "",
      dateEnd: "",
      paymentDateStart: "",
      paymentDateEnd: "",
      building: "",
      block: "",
      apartment: "",
      floor: "",
      status: "",
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

