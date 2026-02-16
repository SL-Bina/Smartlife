import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import usersAPI from "../api";

const mapUser = (x) => {
  return {
    id: x?.id || x?.user_id || null,
    name: x?.name || x?.user_data?.name || x?.full_name || "",
    username: x?.username || x?.user_data?.username || "",
    email: x?.email || x?.user_data?.email || "",
    phone: x?.phone || x?.user_data?.phone || "",
    role: x?.role || x?.user_role || null,
    type: x?.type || x?.user_type || 1,
    status: x?.status || x?.user_status || "active",
    profile_photo: x?.profile_photo || x?.user_data?.profile_photo || null,
  };
};

const DEFAULT_ITEMS_PER_PAGE = 10;

export function useUsersData({ 
  search = "",  
} = {}) {
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [total, setTotal] = useState(0);
  const [lastFetchedPage, setLastFetchedPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(1);
  const hasFetchedRef = useRef(false);

  const fetchPage = useCallback(async (pageNum, searchQuery = "") => {
    try {
      const params = { page: pageNum, per_page: DEFAULT_ITEMS_PER_PAGE };
      
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      const res = await usersAPI.getAll(params);
      const data = res?.data || res;
      const itemsList = data?.data || data || [];
      const list = itemsList.map(mapUser);
      return {
        items: list,
        total: data?.total || data?.meta?.total || itemsList.length || 0,
        lastPage: data?.last_page || data?.meta?.last_page || 1,
        currentPage: data?.current_page || data?.meta?.current_page || pageNum,
      };
    } catch (e) {
      console.error("Users page fetch error:", e);
      return { items: [], total: 0, lastPage: 1, currentPage: pageNum };
    }
  }, []);

  const fetchAllPages = useCallback(async (searchQuery = "") => {
    setLoading(true);
    try {
      const firstPageData = await fetchPage(1, searchQuery);
      let allData = [...firstPageData.items];
      let totalPagesCount = firstPageData.lastPage;
      setTotalPages(totalPagesCount);
      setLastFetchedPage(1);

      if (totalPagesCount > 1) {
        const promises = [];
        for (let i = 2; i <= totalPagesCount; i++) {
          promises.push(fetchPage(i, searchQuery));
        }
        const results = await Promise.all(promises);
        results.forEach((result) => {
          allData.push(...result.items);
          if (result.lastPage > totalPagesCount) {
            totalPagesCount = result.lastPage;
          }
        });
        setLastFetchedPage(totalPagesCount);
        setTotalPages(totalPagesCount);
      }

      setAllItems(allData);
      setTotal(allData.length);
    } catch (e) {
      console.error("Users fetch all error:", e);
      setAllItems([]);
      setTotal(0);
      setTotalPages(1);
      setLastFetchedPage(0);
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchAllPages(search);
  }, []);

  useEffect(() => {
    if (!hasFetchedRef.current) return; 
    
    setCurrentPage(1);
    setLastFetchedPage(0);
    fetchAllPages(search);
  }, [search, fetchAllPages]);

  const currentPageItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allItems.slice(startIndex, endIndex);
  }, [allItems, currentPage, itemsPerPage]);

  const goToPage = useCallback(
    (pageNum) => {
      setCurrentPage(pageNum);
    },
    []
  );

  const currentLastPage = useMemo(() => {
    return Math.ceil(allItems.length / itemsPerPage) || 1;
  }, [allItems.length, itemsPerPage]);

  const refresh = useCallback(() => {
    setLastFetchedPage(0);
    setCurrentPage(1);
    fetchAllPages(search);
  }, [search, fetchAllPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return {
    loading,
    items: currentPageItems,
    rawItems: allItems,
    page: currentPage,
    lastPage: currentLastPage,
    total: allItems.length, 
    itemsPerPage,
    setItemsPerPage,
    goToPage,
    refresh,
  };
}

