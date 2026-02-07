import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import complexAPI from "../api";

const mapComplex = (x) => ({
  id: x?.id,
  name: x?.name || "",
  status: x?.status || "active",
  meta: x?.meta || {},
  bind_mtk: x?.bind_mtk || null,  // list response-da var
  mtk_id: x?.mtk_id ?? null,
});

export function useComplexData({ search = "", mtkId = null, enabled = true } = {}) {
  const [loading, setLoading] = useState(true);

  // MTK seçilməyəndə pagination işləyəcək
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // MTK seçiləndə bütün data burada saxlanacaq
  const [allItems, setAllItems] = useState([]);

  const fetchPage = useCallback(async (p = 1, extraParams = {}) => {
    const res = await complexAPI.getAll({ page: p, ...extraParams });
    const data = res?.data;
    return {
      list: (data?.data || []).map(mapComplex),
      currentPage: data?.current_page || p,
      lastPage: data?.last_page || 1,
    };
  }, []);

  // NORMAL: MTK yoxdur -> tək səhifə yüklə
  const fetchNormal = useCallback(async (p = 1) => {
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
      setAllItems([]); // MTK rejimi deyil
    } catch (e) {
      console.error("Complex list error:", e);
      setItems([]);
      setPage(1);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [fetchPage, enabled]);

  // MTK MODE: MTK var -> bütün səhifələri yığ (backend filter işləməsə belə)
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
      // 1) server filter cəhdi (bəlkə işləyir)
      // işləməsə də, yenə bütün səhifələri yığacağıq
      const first = await fetchPage(1, { mtk_id: mtkId });

      let all = [...first.list];
      let lp = first.lastPage;

      for (let p = 2; p <= lp; p++) {
        const r = await fetchPage(p, { mtk_id: mtkId });
        all.push(...r.list);
        lp = r.lastPage; // ehtiyat üçün
      }

      // Əgər backend mtk_id-i vecinə almırsa, yenə də all gələcək,
      // ona görə client-side filter mütləq:
      const filtered = all.filter((x) => {
        const id1 = x?.bind_mtk?.id;
        const id2 = x?.mtk_id;
        return String(id1 || id2 || "") === String(mtkId);
      });

      setAllItems(filtered);

      // MTK rejimində pagination-i söndürmək üçün:
      setItems([]);       // table allItems-dən gedəcək
      setPage(1);
      setLastPage(1);
    } catch (e) {
      console.error("Complex all-pages error:", e);
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetchPage, mtkId, enabled]);

  // ilk load + mtk dəyişəndə
  const prevMtkIdRef = useRef(null);
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    // React StrictMode-da iki dəfə çağırılmanın qarşısını almaq üçün
    if (hasInitializedRef.current && prevMtkIdRef.current === mtkId) return;
    prevMtkIdRef.current = mtkId;
    hasInitializedRef.current = true;
    
    if (mtkId) fetchAllAndFilter();
    else fetchNormal(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mtkId]); // Yalnız mtkId dəyişəndə yenidən çağır

  // Search filter
  const finalItems = useMemo(() => {
    const base = mtkId ? allItems : items;
    const q = (search || "").trim().toLowerCase();
    if (!q) return base;
    return base.filter((x) => (x.name || "").toLowerCase().includes(q));
  }, [items, allItems, search, mtkId]);

  return {
    loading,
    items: finalItems,

    // pagination yalnız MTK yoxdursa aktiv olsun
    page,
    lastPage,
    goToPage: (p) => (mtkId ? null : fetchNormal(p)),
    refresh: () => (mtkId ? fetchAllAndFilter() : fetchNormal(page)),
  };
}
