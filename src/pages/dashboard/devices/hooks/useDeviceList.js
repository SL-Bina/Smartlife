import { useState, useEffect, useCallback } from "react";
// TODO: Replace static import with devicesAPI.getAll() when endpoint is ready
import devicesDataRaw from "../api/data.json";

const ITEMS_PER_PAGE = 10;

const allDevices = devicesDataRaw?.devices ?? [];

export function useDeviceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterBuilding, setFilterBuilding] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const applyFilters = useCallback(() => {
    let filtered = [...allDevices];

    if (filterName.trim()) {
      filtered = filtered.filter((d) =>
        d.nameLines?.some((ln) =>
          ln.text.toLowerCase().includes(filterName.trim().toLowerCase())
        )
      );
    }
    if (filterBuilding.trim()) {
      filtered = filtered.filter((d) =>
        String(d.building).toLowerCase().includes(filterBuilding.trim().toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(
        (d) => d.userStatus?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    const total = filtered.length;
    const lastPage = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    const safePage = Math.min(page, lastPage);
    const start = (safePage - 1) * ITEMS_PER_PAGE;

    setItems(filtered.slice(start, start + ITEMS_PER_PAGE));
    setTotal(total);
    setLastPage(lastPage);
  }, [filterName, filterBuilding, filterStatus, page]);

  // Fetch / refresh
  const fetchData = useCallback(() => {
    setLoading(true);
    // Simulate async — swap this block with a real API call later:
    //   const res = await devicesAPI.getAll({ page, per_page: ITEMS_PER_PAGE, name: filterName, ... });
    //   setItems(res.data.data.data);
    //   setTotal(res.data.data.total);
    //   setLastPage(res.data.data.last_page);
    setTimeout(() => {
      applyFilters();
      setLoading(false);
    }, 300);
  }, [applyFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = useCallback((p) => setPage(p), []);

  const applySearch = useCallback((filters) => {
    setFilterName(filters.name ?? "");
    setFilterBuilding(filters.building ?? "");
    setFilterStatus(filters.status ?? "");
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    loading,
    page,
    lastPage,
    total,
    itemsPerPage: ITEMS_PER_PAGE,
    filterName,
    filterBuilding,
    filterStatus,
    goToPage,
    applySearch,
    refresh,
  };
}
