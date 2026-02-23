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
      const params = {
        page,
        per_page: itemsPerPage,
      };

      // Separate name and status from other search params
      const { name, status, ...advancedSearch } = search;
      
      // Add name and status to params if they exist
      if (name && name.trim()) {
        params.name = name.trim();
      }
      if (status && status.trim()) {
        params.status = status.trim();
      }

      // Check if there are any search parameters (name, status, or advanced)
      const hasSearchParams = Object.keys(search).length > 0 && Object.keys(search).some(key => search[key] && search[key].toString().trim());

      let response;
      if (hasSearchParams) {
        // Merge advanced search params
        if (Object.keys(advancedSearch).length > 0) {
          Object.assign(params, advancedSearch);
        }
        response = await mtkAPI.search(params);
      } else {
        // No filters, use getAll
        response = await mtkAPI.getAll(params);
      }
      
      const data = response?.data?.data || {};

      setItems(data.data || []);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
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

