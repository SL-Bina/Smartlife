import { useState, useEffect } from "react";
import { fetchDebtorApartments, fetchTotalDebt } from "../api";

const ITEMS_PER_PAGE = 10;

export function useDebtorApartmentsData(filters, page, refreshKey = 0, sortConfig = { key: null, direction: "asc" }) {
  const [apartments, setApartments] = useState([]);
  const [totalDebt, setTotalDebt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: ITEMS_PER_PAGE,
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
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data for sorting
        const [allApartmentsResult, totalDebtResult] = await Promise.all([
          fetchDebtorApartments(filters, 1, 10000),
          fetchTotalDebt(filters),
        ]);

        let sortedData = allApartmentsResult.data || [];

        // Apply sorting
        if (sortConfig.key) {
          sortedData = [...sortedData].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle numeric values
            if (sortConfig.key === "id" || sortConfig.key === "floor" || sortConfig.key === "rooms" || sortConfig.key === "area" || sortConfig.key === "invoiceCount") {
              if (sortConfig.key === "area") {
                aValue = parseFloat(String(aValue).replace(/[m²,\s]/g, "")) || 0;
                bValue = parseFloat(String(bValue).replace(/[m²,\s]/g, "")) || 0;
              } else if (sortConfig.key === "totalDebt") {
                aValue = parseFloat(String(aValue).replace(/[AZN,\s]/g, "")) || 0;
                bValue = parseFloat(String(bValue).replace(/[AZN,\s]/g, "")) || 0;
              } else {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
              }
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
        const total = sortedData.length;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedData = sortedData.slice(startIndex, endIndex);

        setApartments(paginatedData);
        setPagination({
          page,
          itemsPerPage: ITEMS_PER_PAGE,
          total,
          totalPages: Math.ceil(total / ITEMS_PER_PAGE),
        });
        setTotalDebt(totalDebtResult);
      } catch (err) {
        console.error("Error loading debtor apartments data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, page, refreshKey, sortConfig]);

  return {
    apartments,
    totalDebt,
    loading,
    error,
    pagination,
  };
}

