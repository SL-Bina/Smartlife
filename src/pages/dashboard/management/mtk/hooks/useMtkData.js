import { useState, useEffect } from "react";
import { mtkAPI } from "../api";

export function useMtkData(filters, page, refreshKey = 0, sortConfig = { key: null, direction: "asc" }) {
  const [mtk, setMtk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 20,
    total: 0,
    totalPages: 0,
  });

  // Natural sort function
  const naturalSort = (a, b) => {
    const aStr = String(a).toLowerCase();
    const bStr = String(b).toLowerCase();
    const aParts = aStr.match(/(\d+|\D+)/g) || [];
    const bParts = bStr.match(/(\d+|\D+)/g) || [];
    const maxLength = Math.max(aParts.length, bParts.length);
    
    for (let i = 0; i < maxLength; i++) {
      const aPart = aParts[i] || "";
      const bPart = bParts[i] || "";
      if (/^\d+$/.test(aPart) && /^\d+$/.test(bPart)) {
        const aNum = parseInt(aPart, 10);
        const bNum = parseInt(bPart, 10);
        if (aNum !== bNum) return aNum - bNum;
      } else if (aPart !== bPart) {
        return aPart < bPart ? -1 : 1;
      }
    }
    return 0;
  };

  useEffect(() => {
    const fetchMtk = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data for sorting
        const params = {
          page: 1,
          per_page: 10000, // Get all data
        };
        
        if (filters.name) params.name = filters.name;

        const response = await mtkAPI.getAll(params);
        
        if (response.success && response.data) {
          let mtkData = response.data.data || response.data || [];
          mtkData = Array.isArray(mtkData) ? mtkData : [];
          
          // Apply sorting
          if (sortConfig.key) {
            mtkData = [...mtkData].sort((a, b) => {
              let aValue = a[sortConfig.key];
              let bValue = b[sortConfig.key];

              // Handle nested meta values
              if (sortConfig.key === "email") {
                aValue = a.meta?.email || "";
                bValue = b.meta?.email || "";
              } else if (sortConfig.key === "phone") {
                aValue = a.meta?.phone || "";
                bValue = b.meta?.phone || "";
              } else if (sortConfig.key === "address") {
                aValue = a.meta?.address || "";
                bValue = b.meta?.address || "";
              }

              // Handle numeric values
              if (sortConfig.key === "id") {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
              }
              // Handle string values with natural sort
              else if (typeof aValue === "string" && typeof bValue === "string") {
                const comparison = naturalSort(aValue, bValue);
                return sortConfig.direction === "asc" ? comparison : -comparison;
              }

              // Compare numeric values
              if (typeof aValue === "number" && typeof bValue === "number") {
                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
              }

              return 0;
            });
          }
          
          // Apply pagination
          const total = mtkData.length;
          const itemsPerPage = 20;
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedData = mtkData.slice(startIndex, endIndex);
          
          setMtk(paginatedData);
          setPagination({
            page,
            itemsPerPage,
            total,
            totalPages: Math.ceil(total / itemsPerPage),
          });
        } else {
          setMtk([]);
          setPagination({
            page: 1,
            itemsPerPage: 20,
            total: 0,
            totalPages: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching MTK data:", err);
        setError(err.message || "Failed to fetch MTK data");
        setMtk([]);
        setPagination({
          page: 1,
          itemsPerPage: 20,
          total: 0,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMtk();
  }, [filters, page, refreshKey, sortConfig]);

  return {
    mtk,
    loading,
    error,
    pagination,
  };
}

