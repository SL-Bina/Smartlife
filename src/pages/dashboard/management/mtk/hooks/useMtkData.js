import { useState, useEffect, useCallback } from "react";
import mtkAPI from "../api";

export function useMtkData({ search = "" } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Əgər axtarış parametrləri varsa, search endpoint istifadə et
      const hasSearchParams = search && Object.keys(search).length > 0;
      
      if (hasSearchParams) {
        // Axtarış endpoint-i istifadə et
        const response = await mtkAPI.search(search);
        const data = response?.data?.data || {};
        
        setItems(Array.isArray(data) ? data : data.data || []);
        setLastPage(1); // Axtarış nəticələri üçün pagination yoxdur
        setTotal(Array.isArray(data) ? data.length : data.total || 0);
      } else {
        // Normal list endpoint istifadə et
        const params = {
          page,
          per_page: itemsPerPage,
        };

        const response = await mtkAPI.getAll(params);
        const data = response?.data?.data || {};
        
        setItems(data.data || []);
        setLastPage(data.last_page || 1);
        setTotal(data.total || 0);
      }
    } catch (err) {
      setError(err.message || "Məlumat yüklənərkən xəta baş verdi");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setPage(newPage);
    }
  };

  const refresh = () => {
    fetchData();
  };

  return {
    items,
    loading,
    error,
    page,
    lastPage,
    total,
    itemsPerPage,
    setItemsPerPage,
    goToPage,
    refresh,
  };
}

