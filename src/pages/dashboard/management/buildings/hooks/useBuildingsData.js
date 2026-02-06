import { useCallback, useEffect, useMemo, useState } from "react";
import buildingAPI from "../api";

const mapBuilding = (x) => ({
  id: x?.id,
  name: x?.name || "",
  status: x?.status || "active",
  meta: x?.meta || {},
  complex: x?.complex || null, // list response-da var
});

export function useBuildingsData({ search = "", mtkId = null, complexId = null } = {}) {
  const [loading, setLoading] = useState(true);

  // normal pagination (heç nə seçilməyib)
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

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
    [fetchPage]
  );

  const fetchAllAndFilter = useCallback(async () => {
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
  }, [fetchPage, mtkId, complexId]);

  useEffect(() => {
    if (mtkId || complexId) fetchAllAndFilter();
    else fetchNormal(1);
  }, [mtkId, complexId, fetchAllAndFilter, fetchNormal]);

  const finalItems = useMemo(() => {
    const base = mtkId || complexId ? allItems : items;
    const q = (search || "").trim().toLowerCase();
    if (!q) return base;
    return base.filter((x) => (x.name || "").toLowerCase().includes(q));
  }, [items, allItems, search, mtkId, complexId]);

  return {
    loading,
    items: finalItems,
    page,
    lastPage,
    goToPage: (p) => (mtkId || complexId ? null : fetchNormal(p)),
    refresh: () => (mtkId || complexId ? fetchAllAndFilter() : fetchNormal(page)),
  };
}
