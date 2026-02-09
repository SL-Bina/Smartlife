import { useState } from "react";

export function useBlocksFilters() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    address: "",
    email: "",
    phone: "",
  });

  const setFilter = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "", address: "", email: "", phone: "" });
  };

  return { 
    filterOpen, 
    setFilterOpen, 
    filters, 
    setFilter, 
    clearFilters 
  };
}
