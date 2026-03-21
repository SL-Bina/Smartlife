import { useState, useEffect, useCallback } from "react";
import propertiesAPI from "@/services/management/propertiesApi";

export function usePropertyData({ search = {}, mtkId = null, complexId = null, buildingId = null, blockId = null } = {}) {
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

      const { name, status, ...advancedSearch } = search;

      if (name && name.trim()) {
        params.name = name.trim();
      }
      if (status && status.trim()) {
        params.status = status.trim();
      }

      if (mtkId) {
        params.mtk_id = mtkId;
      }
      if (complexId) {
        params.complex_id = complexId;
      }
      if (buildingId) {
        params.building_id = buildingId;
      }
      if (blockId) {
        params.block_id = blockId;
      }

      const hasAdvancedSearch = Object.keys(advancedSearch).length > 0;

      let response;
      if (hasAdvancedSearch || name || status || mtkId || complexId || buildingId || blockId) {
        if (mtkId) {
          params.mtk_ids = [mtkId];
          delete params.mtk_id;
        }
        if (complexId) {
          params.complex_ids = [complexId];
          delete params.complex_id;
        }
        if (buildingId) {
          params.building_ids = [buildingId];
          delete params.building_id;
        }
        if (blockId) {
          params.block_ids = [blockId];
          delete params.block_id;
        }
        if (hasAdvancedSearch) {
          Object.assign(params, advancedSearch);
        }
        response = await propertiesAPI.search(params);
      } else {
        response = await propertiesAPI.getAll(params);
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
  }, [page, itemsPerPage, search, mtkId, complexId, buildingId, blockId]);

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
