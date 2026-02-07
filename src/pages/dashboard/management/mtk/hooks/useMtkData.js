import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import mtkAPI from "../api";

const mapMtk = (x) => ({
  id: x?.id,
  name: x?.name || "",
  status: x?.status || "active",
  meta: x?.meta || {},
  complex_count: x?.complex_count ?? x?._counts?.complexes ?? x?.complexes_count,
});

const ITEMS_PER_PAGE = 10;

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
  const [allItems, setAllItems] = useState([]); // Bütün yüklənmiş məlumatlar
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastFetchedPage, setLastFetchedPage] = useState(0); // Son yüklənmiş səhifə
  const [totalPages, setTotalPages] = useState(1);
  const hasFetchedRef = useRef(false);

  // Tək səhifə yüklə (yalnız search üçün, filter yox)
  const fetchPage = useCallback(async (pageNum, searchQuery = "") => {
    try {
      const params = { page: pageNum, per_page: ITEMS_PER_PAGE };
      
      // Yalnız search parametri (filter frontend-də olacaq)
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

  // Bütün səhifələri yüklə (yalnız search üçün, filter frontend-də)
  const fetchAllPages = useCallback(async (searchQuery = "") => {
    setLoading(true);
    try {
      // İlk səhifəni yüklə
      const firstPageData = await fetchPage(1, searchQuery);
      let allData = [...firstPageData.items];
      let totalPagesCount = firstPageData.lastPage;
      setTotalPages(totalPagesCount);
      setLastFetchedPage(1);

      // Qalan səhifələri yüklə (əgər varsa)
      if (totalPagesCount > 1) {
        const promises = [];
        for (let i = 2; i <= totalPagesCount; i++) {
          promises.push(fetchPage(i, searchQuery));
        }
        const results = await Promise.all(promises);
        results.forEach((result) => {
          allData.push(...result.items);
          // Əgər backend-dən gələn lastPage daha böyükdürsə, yenilə
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

  // Növbəti səhifəni yüklə (lazy loading)
  const loadNextPage = useCallback(async (searchQuery = "") => {
    if (lastFetchedPage >= totalPages) return; // Artıq bütün səhifələr yüklənib

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

  // İlk yükləmə
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchAllPages(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search dəyişəndə yenidən yüklə (filter frontend-də olacaq)
  useEffect(() => {
    if (!hasFetchedRef.current) return; // İlk yükləmə hələ baş verməyibsə gözlə
    
    setCurrentPage(1);
    setLastFetchedPage(0);
    fetchAllPages(search);
  }, [search, fetchAllPages]);

  // Frontend-də filter et
  const filteredItems = useMemo(() => {
    let filtered = [...allItems];
    
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
    
    // Website filter
    if (filterWebsite && filterWebsite.trim()) {
      const websiteLower = filterWebsite.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        (item.meta?.website || "").toLowerCase().includes(websiteLower)
      );
    }
    
    // Color filter
    if (filterColor && filterColor.trim()) {
      const colorLower = filterColor.trim().toLowerCase();
      filtered = filtered.filter((item) => 
        (item.meta?.color_code || "").toLowerCase().includes(colorLower)
      );
    }
    
    return filtered;
  }, [allItems, filterStatus, filterAddress, filterEmail, filterPhone, filterWebsite, filterColor]);

  // Cari səhifənin məlumatları (filter edilmiş məlumatlardan)
  const currentPageItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage]);

  // Səhifə dəyişdir
  const goToPage = useCallback(
    (pageNum) => {
      setCurrentPage(pageNum);
      
      // Əgər sonuncu səhifədəyiksə və növbəti səhifə yüklənməyibsə, yüklə
      const totalPagesFromItems = Math.ceil(allItems.length / ITEMS_PER_PAGE);
      if (pageNum >= totalPagesFromItems && lastFetchedPage < totalPages) {
        loadNextPage(search);
      }
    },
    [allItems.length, lastFetchedPage, totalPages, loadNextPage, search]
  );

  // Cari səhifələrin sayı (filter edilmiş məlumatlara görə)
  const currentLastPage = useMemo(() => {
    return Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  }, [filteredItems.length]);

  // Həqiqi son səhifə (backend-dən gələn)
  const realLastPage = useMemo(() => {
    return totalPages;
  }, [totalPages]);

  const refresh = useCallback(() => {
    setLastFetchedPage(0);
    setCurrentPage(1);
    fetchAllPages(search);
  }, [search, fetchAllPages]);

  // Filter dəyişəndə səhifəni 1-ə qaytar
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterAddress, filterEmail, filterPhone, filterWebsite, filterColor]);

  return {
    loading,
    items: currentPageItems,
    rawItems: allItems,
    filteredItems: filteredItems,
    page: currentPage,
    lastPage: currentLastPage,
    realLastPage: realLastPage,
    total: filteredItems.length, // Filter edilmiş məlumatların sayı
    goToPage,
    refresh,
  };
}
