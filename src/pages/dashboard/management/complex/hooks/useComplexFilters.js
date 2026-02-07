import { useState } from "react";

export function useComplexFilters() {
  const [filters, setFilters] = useState({
    mtk_id: "", // ✅ select buranı dolduracaq
    search: "",
    status: "",
  });

  const updateFilter = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ mtk_id: "", search: "", status: "" });
  };

  return { filters, updateFilter, clearFilters };
}
