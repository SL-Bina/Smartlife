import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import mtkAPI from "../api";

const mapMtk = (x) => ({
  id: x?.id,
  name: x?.name || "",
  status: x?.status || "active",
  meta: x?.meta || {},
  complex_count: x?.complex_count ?? x?._counts?.complexes ?? x?.complexes_count,
});

const DEFAULT_ITEMS_PER_PAGE = 10;
const STANDARD_OPTIONS = [10, 25, 50, 75, 100];

export function useMtkData({ 
  search = "",  
  filterStatus = "",
  filterAddress = "",
  filterEmail = "",
  filterPhone = "",
  filterWebsite = "",
  filterColor = ""
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
      
      const res = await mtkAPI.getAll(params);
      const data = res?.data;
      const list = (data?.data || []).map(mapMtk);
      return {
        items: list,
        total: data?.total || 0,
        lastPage: data?.last_page || 1,
        currentPage: data?.current_page || pageNum,
      };
    } catch (e) {
      console.error("MTK page fetch error:", e);
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
    } catch (e) {
      console.error("MTK fetch all error:", e);
      setAllItems([]);
      setTotal(0);
      setTotalPages(1);
      setLastFetchedPage(0);
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  const loadNextPage = useCallback(async (searchQuery = "") => {
    if (lastFetchedPage >= totalPages) return; 

    try {
      const nextPage = lastFetchedPage + 1;
      const pageData = await fetchPage(nextPage, searchQuery);
      setAllItems((prev) => [...prev, ...pageData.items]);
      setLastFetchedPage(nextPage);
      setTotal(pageData.total);
      setTotalPages(pageData.lastPage);
    } catch (e) {
      console.error("MTK load next page error:", e);
    }
  }, [lastFetchedPage, totalPages, fetchPage]);

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

  const filteredItems = useMemo(() => {
    let filtered = [...allItems];
    
    if (filterStatus && filterStatus.trim()) {
      filtered = filtered.filter((item) => item.status === filterStatus.trim());
    }
    
    if (filterAddress && filterAddress.trim()) {
      const addressLower = filterAddress.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        (item.meta?.address || "").toLowerCase().includes(addressLower)
      );
    }
    
    if (filterEmail && filterEmail.trim()) {
      const emailLower = filterEmail.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        (item.meta?.email || "").toLowerCase().includes(emailLower)
      );
    }
    
    if (filterPhone && filterPhone.trim()) {
      const phoneLower = filterPhone.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        (item.meta?.phone || "").toLowerCase().includes(phoneLower)
      );
    }
    
    if (filterWebsite && filterWebsite.trim()) {
      const websiteLower = filterWebsite.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        (item.meta?.website || "").toLowerCase().includes(websiteLower)
      );
    }
    
    if (filterColor && filterColor.trim()) {
      const colorLower = filterColor.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        (item.meta?.color_code || "").toLowerCase().includes(colorLower)
      );
    }
    
    return filtered;
  }, [allItems, filterStatus, filterAddress, filterEmail, filterPhone, filterWebsite, filterColor]);

  const currentPageItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const goToPage = useCallback(
    (pageNum) => {
      setCurrentPage(pageNum);
      
      const totalPagesFromItems = Math.ceil(allItems.length / itemsPerPage);
      if (pageNum >= totalPagesFromItems && lastFetchedPage < totalPages) {
        loadNextPage(search);
      }
    },
    [allItems.length, lastFetchedPage, totalPages, loadNextPage, search, itemsPerPage]
  );

  const currentLastPage = useMemo(() => {
    return Math.ceil(filteredItems.length / itemsPerPage) || 1;
  }, [filteredItems.length, itemsPerPage]);

  const realLastPage = useMemo(() => {
    return totalPages;
  }, [totalPages]);

  const refresh = useCallback(() => {
    setLastFetchedPage(0);
    setCurrentPage(1);
    fetchAllPages(search);
  }, [search, fetchAllPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterAddress, filterEmail, filterPhone, filterWebsite, filterColor]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return {
    loading,
    items: currentPageItems,
    rawItems: allItems,
    filteredItems: filteredItems,
    page: currentPage,
    lastPage: currentLastPage,
    realLastPage: realLastPage,
    total: filteredItems.length, 
    itemsPerPage,
    setItemsPerPage,
    goToPage,
    refresh,
  };
}
