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

export function useBlocksData(filters, page) {
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

  // Filter data
  const filteredData = useMemo(() => {
    if (!filters.name && !filters.building) {
      return data;
    }

    return data.filter((block) => {
      const matchesName = !filters.name || 
        block.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesBuilding = !filters.building || 
        block.building.toLowerCase().includes(filters.building.toLowerCase());
      
      return matchesName && matchesBuilding;
    });
  }, [data, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    blocks: pageData,
    loading,
    pagination: {
      totalPages,
      currentPage: page,
      totalItems: filteredData.length,
    },
  };
}

