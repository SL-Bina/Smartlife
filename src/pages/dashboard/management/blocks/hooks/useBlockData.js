import { useState, useEffect, useCallback } from "react";
import blocksAPI from "../api";

export function useBlockData({ search = {}, complexId = null, buildingId = null, mtkId = null } = {}) {
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

      // Check if there are any advanced search parameters
      const hasAdvancedSearch = Object.keys(advancedSearch).length > 0;
      const hasFilters = mtkId || complexId || buildingId;

      let response;
      if (hasAdvancedSearch || name || status || hasFilters) {
        // Format IDs as arrays for search endpoint
        if (mtkId) {
          params.mtk_ids = [mtkId];
        }
        if (complexId) {
          params.complex_ids = [complexId];
        }
        if (buildingId) {
          params.building_ids = [buildingId];
        }
        // Merge advanced search params
        if (hasAdvancedSearch) {
          Object.assign(params, advancedSearch);
        }
        response = await blocksAPI.search(params);
      } else {
        response = await blocksAPI.getAll(params);
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
  }, [page, itemsPerPage, search, complexId, buildingId, mtkId]);

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

