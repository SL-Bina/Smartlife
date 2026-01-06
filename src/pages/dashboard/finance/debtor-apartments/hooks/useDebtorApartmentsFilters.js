import { useState } from "react";

export function useDebtorApartmentsFilters() {
  const [filters, setFilters] = useState({
    debtAmountMin: "",
    debtAmountMax: "",
    building: "",
    block: "",
    apartment: "",
    floorMin: "",
    floorMax: "",
    areaMin: "",
    areaMax: "",
    roomsMin: "",
    roomsMax: "",
    invoiceCountMin: "",
    invoiceCountMax: "",
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
      debtAmountMin: "",
      debtAmountMax: "",
      building: "",
      block: "",
      apartment: "",
      floorMin: "",
      floorMax: "",
      areaMin: "",
      areaMax: "",
      roomsMin: "",
      roomsMax: "",
      invoiceCountMin: "",
      invoiceCountMax: "",
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

