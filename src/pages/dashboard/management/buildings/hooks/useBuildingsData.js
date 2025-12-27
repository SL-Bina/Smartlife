import { useState, useEffect, useMemo } from "react";

const ITEMS_PER_PAGE = 10;

const generateData = () => {
  return Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Bina ${index + 1}`,
    complex: `Kompleks ${Math.floor(index / 5) + 1}`,
    blocks: Math.floor(Math.random() * 5) + 1,
    apartments: Math.floor(Math.random() * 80) + 20,
  }));
};

export function useBuildingsData(filters, page) {
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
    if (!filters.name && !filters.complex) {
      return data;
    }

    return data.filter((building) => {
      const matchesName = !filters.name || 
        building.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesComplex = !filters.complex || 
        building.complex.toLowerCase().includes(filters.complex.toLowerCase());
      
      return matchesName && matchesComplex;
    });
  }, [data, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    buildings: pageData,
    loading,
    pagination: {
      totalPages,
      currentPage: page,
      totalItems: filteredData.length,
    },
  };
}

