import { useState, useEffect, useMemo } from "react";
import { mtkAPI } from "../api";

const ITEMS_PER_PAGE = 10;

export function useMtkData(filters, page, refreshKey = 0) {
  const [mtk, setMtk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMtk = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await mtkAPI.getAll();
        
        if (response.success && response.data) {
          setMtk(response.data);
        } else {
          setMtk([]);
        }
      } catch (err) {
        console.error("Error fetching MTK data:", err);
        setError(err.message || "Failed to fetch MTK data");
        setMtk([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMtk();
  }, [refreshKey]);

  const filteredData = useMemo(() => {
    let filtered = [...mtk];
    
    // Name filter
    if (filters.name) {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    return filtered;
  }, [mtk, filters]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    mtk: pageData,
    loading,
    error,
    pagination: {
      page,
      itemsPerPage: ITEMS_PER_PAGE,
      total: filteredData.length,
      totalPages,
    },
  };
}

