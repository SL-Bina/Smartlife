import { useState } from "react";

export function usePropertiesFilters() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    number: "",
    block: "",
    area: "",
  });

  const setFilter = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "", number: "", block: "", area: "" });
  };

  return { 
    filterOpen, 
    setFilterOpen, 
    filters, 
    setFilter, 
    clearFilters 
  };
}
