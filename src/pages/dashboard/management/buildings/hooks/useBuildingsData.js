import { useState, useEffect } from "react";
import { buildingsAPI } from "../api";

export function useBuildingsData(filters, page, refreshKey = 0, sortConfig = { key: null, direction: "asc" }) {
  const [buildings, setBuildings] = useState([]);
  const [allBuildings, setAllBuildings] = useState([]);
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
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data for sorting
        const params = {
          page: 1,
          per_page: 10000, // Get all data
        };
        
        if (filters.name) params.name = filters.name;
        if (filters.complex) params.complex = filters.complex;
        if (filters.status) params.status = filters.status;

        const response = await buildingsAPI.getAll(params);
        
        if (response.success && response.data) {
          let buildingsData = response.data.data || [];
          
          // Apply sorting
          if (sortConfig.key) {
            buildingsData = [...buildingsData].sort((a, b) => {
              let aValue = a[sortConfig.key];
              let bValue = b[sortConfig.key];

              // Handle complex nested value
              if (sortConfig.key === "complex") {
                aValue = a.complex?.name || "";
                bValue = b.complex?.name || "";
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

          setAllBuildings(buildingsData);
          
          // Apply pagination
          const total = buildingsData.length;
          const itemsPerPage = 20;
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedData = buildingsData.slice(startIndex, endIndex);
          
          setBuildings(paginatedData);
          setPagination({
            page,
            itemsPerPage,
            total,
            totalPages: Math.ceil(total / itemsPerPage),
          });
        } else {
          setBuildings([]);
          setAllBuildings([]);
          setPagination({
            page: 1,
            itemsPerPage: 20,
            total: 0,
            totalPages: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching Buildings data:", err);
        setError(err.message || "Failed to fetch Buildings data");
        setBuildings([]);
        setAllBuildings([]);
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

    fetchBuildings();
  }, [filters, page, refreshKey, sortConfig]);

  return {
    buildings,
    loading,
    error,
    pagination,
  };
}

