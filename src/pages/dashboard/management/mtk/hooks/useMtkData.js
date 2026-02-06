import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import mtkAPI from "../api";

const mapMtk = (x) => ({
  id: x?.id,
  name: x?.name || "",
  status: x?.status || "active",
  meta: x?.meta || {},
  complex_count: x?.complex_count ?? x?._counts?.complexes ?? x?.complexes_count,
});

export function useMtkData({ search = "" } = {}) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const hasFetchedRef = useRef(false); // React StrictMode-da iki dəfə çağırılmanın qarşısını almaq üçün

  const fetchList = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await mtkAPI.getAll({ page: p });
      const data = res?.data;
      const list = data?.data || [];
      setItems(list.map(mapMtk));
      setPage(data?.current_page || p);
      setLastPage(data?.last_page || 1);
    } catch (e) {
      console.error("MTK list error:", e);
      setItems([]);
      setPage(1);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // React StrictMode-da iki dəfə çağırılmanın qarşısını almaq üçün
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Yalnız bir dəfə çağırılmalıdır

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) => (x.name || "").toLowerCase().includes(q));
  }, [items, search]);

  return {
    loading,
    items: filtered,
    rawItems: items,
    page,
    lastPage,
    goToPage: (p) => fetchList(p),
    refresh: () => fetchList(page),
  };
}
