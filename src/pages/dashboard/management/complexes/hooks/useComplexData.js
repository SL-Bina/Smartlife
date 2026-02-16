import { useState, useEffect, useCallback } from "react";
import complexesAPI from "../api";

export function useComplexData({ search = {}, mtkId = null } = {}) {
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
        ...(mtkId && { mtk_id: mtkId }),
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

      // Check if there are any advanced search parameters
      const hasAdvancedSearch = Object.keys(advancedSearch).length > 0;

      let response;
      if (hasAdvancedSearch) {
        // Merge advanced search params
        Object.assign(params, advancedSearch);
        response = await complexesAPI.search(params);
      } else if (name || status) {
        // If only name or status, use search endpoint
        response = await complexesAPI.search(params);
      } else {
        // No filters, use getAll
        response = await complexesAPI.getAll(params);
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
  }, [page, itemsPerPage, search, mtkId]);

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

