import { useState, useEffect, useMemo } from "react";
import { useManagement } from "@/context";

const ITEMS_PER_PAGE = 10;

export function useMtkData(filters, page, refreshKey = 0) {
  const { data } = useManagement();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  const filteredData = useMemo(() => {
    let filtered = [...data.mtk];
    
    if (filters.name) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    return filtered;
  }, [data.mtk, filters, refreshKey]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    mtk: pageData,
    loading,
    pagination: {
      page,
      itemsPerPage: ITEMS_PER_PAGE,
      total: filteredData.length,
      totalPages,
    },
  };
}

