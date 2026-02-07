import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import blocksAPI from "../api";

const mapBlock = (x) => ({
  id: x?.id,
  name: x?.name || "",
  status: x?.status || "active",
  meta: x?.meta || {},
  building: x?.building || null,
  complex: x?.complex || null,
  building_id: x?.building_id ?? x?.building?.id ?? null,
  complex_id: x?.complex_id ?? x?.complex?.id ?? null,
});

const DEFAULT_ITEMS_PER_PAGE = 10;

export function useBlocksData({ 
  search = "", 
  mtkId = null, 
  complexId = null,
  buildingId = null,
  enabled = true,
  filterStatus = "",
  filterAddress = "",
  filterEmail = "",
  filterPhone = ""
} = {}) {
  const [loading, setLoading] = useState(true);

  // Normal pagination (heç nə seçilməyib)
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // Scope mode (mtk/complex/building seçilib) -> bütün səhifələr
  const [allItems, setAllItems] = useState([]);

  const fetchPage = useCallback(async (p = 1, extraParams = {}) => {
    const res = await blocksAPI.getAll({ page: p, ...extraParams });
    let responseData = res;
    
    if (responseData?.success && responseData?.data) {
      responseData = responseData.data;
    } else if (responseData?.data) {
      responseData = responseData.data;
    }
    
    return {
      list: (responseData?.data || []).map(mapBlock),
      currentPage: responseData?.current_page || p,
      lastPage: responseData?.last_page || 1,
    };
  }, []);

  // NORMAL: Scope yoxdur -> tək səhifə yüklə
  const fetchNormal = useCallback(
    async (p = 1) => {
      if (!enabled) {
        setLoading(false);
        setItems([]);
        setPage(1);
        setLastPage(1);
        setAllItems([]);
        return;
      }
      
      setLoading(true);
      try {
        const r = await fetchPage(p);
        setItems(r.list);
        setPage(r.currentPage);
        setLastPage(r.lastPage);
        setAllItems([]);
      } catch (e) {
        console.error("Blocks list error:", e);
        setItems([]);
        setPage(1);
        setLastPage(1);
      } finally {
        setLoading(false);
      }
    },
    [fetchPage, enabled]
  );

  // SCOPE MODE: Scope var -> bütün səhifələri yığ (client-side filter)
  const fetchAllAndFilter = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      setAllItems([]);
      setItems([]);
      setPage(1);
      setLastPage(1);
      return;
    }
    
    setLoading(true);
    try {
      const params = {};
      if (buildingId) params.building_id = buildingId;
      if (complexId) params.complex_id = complexId;
      if (mtkId) params.mtk_id = mtkId;

      const first = await fetchPage(1, params);
      let all = [...first.list];
      let lp = first.lastPage;

      for (let p = 2; p <= lp; p++) {
        const r = await fetchPage(p, params);
        all.push(...r.list);
        lp = r.lastPage;
      }

      // Client-side filter
      const filtered = all.filter((b) => {
        const building = b?.building;
        const buildingIdFromBlock = building?.id || b?.building_id;
        const complex = b?.complex || building?.complex;
        const complexIdFromBlock = complex?.id || b?.complex_id;
        const complexMtkId = complex?.bind_mtk?.id || complex?.mtk_id || null;

        if (buildingId) {
          if (String(buildingIdFromBlock || "") !== String(buildingId)) {
            return false;
          }
        }

        if (complexId && !buildingId) {
          if (String(complexIdFromBlock || "") !== String(complexId)) {
            return false;
          }
        }

        if (mtkId && !complexId && !buildingId) {
          if (String(complexMtkId || "") !== String(mtkId)) {
            return false;
          }
        }

        return true;
      });

      setAllItems(filtered);
      setItems([]);
      setPage(1);
      setLastPage(1);
    } catch (e) {
      console.error("Blocks all-pages error:", e);
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetchPage, mtkId, complexId, buildingId, enabled]);

  // ilk load + scope dəyişəndə + enabled dəyişəndə
  const prevFiltersRef = useRef({ mtkId: null, complexId: null, buildingId: null });
  const prevEnabledRef = useRef(null);
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (!enabled) {
      if (!hasInitializedRef.current) {
        setLoading(false);
      }
      return;
    }

    const enabledChanged = prevEnabledRef.current === false && enabled === true;
    if (hasInitializedRef.current && 
        prevFiltersRef.current.mtkId === mtkId && 
        prevFiltersRef.current.complexId === complexId &&
        prevFiltersRef.current.buildingId === buildingId &&
        prevEnabledRef.current === enabled && 
        !enabledChanged) {
      return;
    }
    prevFiltersRef.current = { mtkId, complexId, buildingId };
    prevEnabledRef.current = enabled;
    hasInitializedRef.current = true;
    
    if (mtkId || complexId || buildingId) fetchAllAndFilter();
    else fetchNormal(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mtkId, complexId, buildingId, enabled]);

  // Search and filter
  const finalItems = useMemo(() => {
    let filtered = (mtkId || complexId || buildingId) ? allItems : items;
    
    // Search filter
    const q = (search || "").trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((x) => (x.name || "").toLowerCase().includes(q));
    }
    
    // Status filter
    if (filterStatus && filterStatus.trim()) {
      filtered = filtered.filter((item) => item.status === filterStatus.trim());
    }
    
    // Address filter
    if (filterAddress && filterAddress.trim()) {
      const addressLower = filterAddress.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        (item.meta?.address || "").toLowerCase().includes(addressLower)
      );
    }
    
    // Email filter
    if (filterEmail && filterEmail.trim()) {
      const emailLower = filterEmail.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        (item.meta?.email || "").toLowerCase().includes(emailLower)
      );
    }
    
    // Phone filter
    if (filterPhone && filterPhone.trim()) {
      const phoneLower = filterPhone.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        (item.meta?.phone || "").toLowerCase().includes(phoneLower)
      );
    }
    
    return filtered;
  }, [items, allItems, search, mtkId, complexId, buildingId, filterStatus, filterAddress, filterEmail, filterPhone]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    if (mtkId || complexId || buildingId) {
      // Scope rejimində frontend pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return finalItems.slice(startIndex, endIndex);
    }
    return finalItems;
  }, [finalItems, page, itemsPerPage, mtkId, complexId, buildingId]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (mtkId || complexId || buildingId) {
      return Math.ceil(finalItems.length / itemsPerPage) || 1;
    }
    return lastPage;
  }, [finalItems.length, itemsPerPage, mtkId, complexId, buildingId, lastPage]);

  // Items per page dəyişəndə səhifəni 1-ə qaytar
  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  return {
    loading,
    items: paginatedItems,
    filteredItems: finalItems,
    total: finalItems.length,

    page,
    lastPage: totalPages,
    itemsPerPage,
    setItemsPerPage,
    goToPage: (p) => {
      setPage(p);
      if (!mtkId && !complexId && !buildingId) {
        fetchNormal(p);
      }
    },
    refresh: () => ((mtkId || complexId || buildingId) ? fetchAllAndFilter() : fetchNormal(page)),
  };
}
