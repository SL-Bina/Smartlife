import { useCallback, useEffect, useMemo, useState } from "react";
import blocksAPI from "../api";

const mapBlock = (x) => ({
  id: x?.id,
  name: x?.name || "",
  meta: x?.meta || {},
  building: x?.building || null,
  complex: x?.complex || null,
  building_id: x?.building_id ?? x?.building?.id ?? null,
  complex_id: x?.complex_id ?? x?.complex?.id ?? null,
});

export function useBlocksData({ search = "", mtkId = null, complexId = null, buildingId = null } = {}) {
  const [loading, setLoading] = useState(true);

  // normal pagination (heç nə seçilməyib)
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // scope mode (mtk/complex/building seçilib) -> bütün səhifələr
  const [allItems, setAllItems] = useState([]);

  const fetchPage = useCallback(async (p = 1, extraParams = {}) => {
    const res = await blocksAPI.getAll({ page: p, ...extraParams });
    // API response: { success: true, data: { data: [...], current_page: 1, last_page: 1 } }
    let responseData = res;
    
    // Əgər success: true formatındadırsa
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

  const fetchNormal = useCallback(
    async (p = 1) => {
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
    [fetchPage]
  );

  const fetchAllAndFilter = useCallback(async () => {
    setLoading(true);
    try {
      // server filter cəhdi (işləsə yaxşı)
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

      // client-side filter (backend vecinə almasa belə)
      // Əsas prioritet: buildingId seçilibsə, yalnız həmin binaya aid bloklar
      const filtered = all.filter((b) => {
        const building = b?.building;
        const buildingIdFromBlock = building?.id || b?.building_id;
        const complex = b?.complex || building?.complex;
        const complexIdFromBlock = complex?.id || b?.complex_id;
        const complexMtkId = complex?.bind_mtk?.id || complex?.mtk_id || null;

        // Əgər buildingId seçilibsə, yalnız həmin binaya aid bloklar
        if (buildingId) {
          if (String(buildingIdFromBlock || "") !== String(buildingId)) {
            return false;
          }
        }

        // Əgər complexId seçilibsə (və buildingId seçilməyibsə), kompleks-ə görə filter et
        if (complexId && !buildingId) {
          if (String(complexIdFromBlock || "") !== String(complexId)) {
            return false;
          }
        }

        // Əgər mtkId seçilibsə (və complexId/buildingId seçilməyibsə), MTK-ya görə filter et
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
  }, [fetchPage, mtkId, complexId, buildingId]);

  useEffect(() => {
    if (mtkId || complexId || buildingId) fetchAllAndFilter();
    else fetchNormal(1);
  }, [mtkId, complexId, buildingId, fetchAllAndFilter, fetchNormal]);

  const finalItems = useMemo(() => {
    const base = mtkId || complexId || buildingId ? allItems : items;
    const q = (search || "").trim().toLowerCase();
    if (!q) return base;
    return base.filter((x) => (x.name || "").toLowerCase().includes(q));
  }, [items, allItems, search, mtkId, complexId, buildingId]);

  return {
    loading,
    items: finalItems,
    page,
    lastPage,
    goToPage: (p) => (mtkId || complexId || buildingId ? null : fetchNormal(p)),
    refresh: () => (mtkId || complexId || buildingId ? fetchAllAndFilter() : fetchNormal(page)),
  };
}
