import { useState, useEffect, useMemo } from "react";

const ITEMS_PER_PAGE = 10;

const generateData = () => {
  return Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Blok ${String.fromCharCode(65 + (index % 5))}-${Math.floor(index / 5) + 1}`,
    building: `Bina ${Math.floor(index / 5) + 1}`,
    floors: (index % 16) + 5,
    apartments: Math.floor(Math.random() * 40) + 10,
  }));
};

export function useBlocksData(filters, page, sortConfig = { key: null, direction: "asc" }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const generatedData = generateData();
      setData(generatedData);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

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

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    if (filters.name || filters.building) {
      result = result.filter((block) => {
        const matchesName = !filters.name || 
          block.name.toLowerCase().includes(filters.name.toLowerCase());
        const matchesBuilding = !filters.building || 
          block.building.toLowerCase().includes(filters.building.toLowerCase());
        return matchesName && matchesBuilding;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result = result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle numeric values
        if (sortConfig.key === "id" || sortConfig.key === "floors" || sortConfig.key === "apartments") {
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

    return result;
  }, [data, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    blocks: pageData,
    loading,
    pagination: {
      totalPages,
      currentPage: page,
      totalItems: filteredAndSortedData.length,
    },
  };
}

