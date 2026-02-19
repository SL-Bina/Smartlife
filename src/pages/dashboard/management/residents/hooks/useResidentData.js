import { useState, useEffect, useCallback } from "react";
import residentsAPI from "../api";

export function useResidentData({ search = {}, mtkId = null, complexId = null, buildingId = null, blockId = null, propertyId = null } = {}) {
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
        ...(complexId && { complex_id: complexId }),
        ...(buildingId && { building_id: buildingId }),
        ...(blockId && { block_id: blockId }),
        ...(propertyId && { property_id: propertyId }),
      };

      const { name, status, ...advancedSearch } = search;
      
      if (name && name.trim()) {
        params.name = name.trim();
      }
      if (status && status.trim()) {
        params.status = status.trim();
      }

      const hasAdvancedSearch = Object.keys(advancedSearch).length > 0;

      let response;
      if (hasAdvancedSearch || name || status || mtkId || complexId || buildingId || blockId || propertyId) {
        Object.assign(params, advancedSearch);
        response = await residentsAPI.search(params);
      } else {
        response = await residentsAPI.getAll(params);
      }
      
      const data = response?.data?.data || {};
      
      setItems(Array.isArray(data) ? data : data.data || []);
      setLastPage(Array.isArray(data) ? 1 : data.last_page || 1);
      setTotal(Array.isArray(data) ? data.length : data.total || 0);
    } catch (err) {
      setError(err.message || "Məlumat yüklənərkən xəta baş verdi");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, itemsPerPage, search, mtkId, complexId, buildingId, blockId, propertyId]);

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

