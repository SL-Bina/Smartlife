import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import buildingAPI from "../api";

const mapBuilding = (x) => ({
  id: x?.id,
  name: x?.name || "",
  status: x?.status || "active",
  meta: x?.meta || {},
  complex: x?.complex || null, // list response-da var
});

const DEFAULT_ITEMS_PER_PAGE = 10;

export function useBuildingsData({ 
  search = "", 
  mtkId = null, 
  complexId = null, 
  enabled = true,
  filterStatus = "",
  filterAddress = "",
  filterEmail = "",
  filterPhone = ""
} = {}) {
  const [loading, setLoading] = useState(true);

  // normal pagination (heç nə seçilməyib)
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // scope mode (mtk/complex seçilib) -> bütün səhifələr
  const [allItems, setAllItems] = useState([]);

  const fetchPage = useCallback(async (p = 1, extraParams = {}) => {
    const res = await buildingAPI.getAll({ page: p, ...extraParams });
    const data = res?.data;
    return {
      list: (data?.data || []).map(mapBuilding),
      currentPage: data?.current_page || p,
      lastPage: data?.last_page || 1,
    };
  }, []);

  const fetchNormal = useCallback(
    async (p = 1) => {
      // Əgər enabled false-dursa, API sorğusu göndərmə
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
        console.error("Buildings list error:", e);
        setItems([]);
        setPage(1);
        setLastPage(1);
      } finally {
        setLoading(false);
      }
    },
    [fetchPage, enabled]
  );

  const fetchAllAndFilter = useCallback(async () => {
    // Əgər enabled false-dursa, API sorğusu göndərmə
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
      // server filter cəhdi (işləsə yaxşı)
      const params = {};
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

      // client-side filter (backend vecinə almasa belə)
      // Əsas prioritet: complexId seçilibsə, yalnız həmin kompleks-ə aid binalar
      const filtered = all.filter((b) => {
        const c = b?.complex;
        const cId = c?.id;
        const cMtkId = c?.bind_mtk?.id || c?.mtk_id || null;
        const buildingComplexId = b?.complex_id;

        // Əgər complexId seçilibsə, yalnız həmin kompleks-ə aid binalar
        if (complexId) {
          // Əvvəlcə complex object-dən, sonra direct complex_id-dən yoxla
          if (String(cId || "") !== String(complexId) && String(buildingComplexId || "") !== String(complexId)) {
            return false;
          }
        }

        // Əgər mtkId seçilibsə (və complexId seçilməyibsə), MTK-ya görə filter et
        if (mtkId && !complexId) {
          if (String(cMtkId || "") !== String(mtkId)) return false;
        }

        return true;
      });

      setAllItems(filtered);
      setItems([]);
      setPage(1);
      setLastPage(1);
    } catch (e) {
      console.error("Buildings all-pages error:", e);
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetchPage, mtkId, complexId, enabled]);

  const prevFiltersRef = useRef({ mtkId: null, complexId: null });
  const prevEnabledRef = useRef(null);
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    // Əgər enabled false-dursa, gözlə (yalnız ilk dəfə deyilsə)
    if (!enabled) {
      if (!hasInitializedRef.current) {
        setLoading(false);
      }
      return;
    }

    // React StrictMode-da iki dəfə çağırılmanın qarşısını almaq üçün
    // Amma enabled false-dan true-a keçəndə yenidən çağır
    const enabledChanged = prevEnabledRef.current === false && enabled === true;
    if (hasInitializedRef.current && prevFiltersRef.current.mtkId === mtkId && prevFiltersRef.current.complexId === complexId && prevEnabledRef.current === enabled && !enabledChanged) {
      return;
    }
    prevFiltersRef.current = { mtkId, complexId };
    prevEnabledRef.current = enabled;
    hasInitializedRef.current = true;
    
    if (mtkId || complexId) fetchAllAndFilter();
    else fetchNormal(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mtkId, complexId, enabled]); // mtkId, complexId və enabled dəyişəndə yenidən çağır

  // Search and filter
  const finalItems = useMemo(() => {
    let filtered = mtkId || complexId ? allItems : items;
    
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
  }, [items, allItems, search, mtkId, complexId, filterStatus, filterAddress, filterEmail, filterPhone]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    if (mtkId || complexId) {
      // Scope rejimində frontend pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return finalItems.slice(startIndex, endIndex);
    }
    return finalItems;
  }, [finalItems, page, itemsPerPage, mtkId, complexId]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (mtkId || complexId) {
      return Math.ceil(finalItems.length / itemsPerPage) || 1;
    }
    return lastPage;
  }, [finalItems.length, itemsPerPage, mtkId, complexId, lastPage]);

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
      if (!mtkId && !complexId) {
        fetchNormal(p);
      }
    },
    refresh: () => (mtkId || complexId ? fetchAllAndFilter() : fetchNormal(page)),
  };
}
