import { useState, useEffect, useMemo } from "react";

const mockGroups = [
  {
    id: 1,
    name: "A Blok - 1-ci giriş",
    building: "Bina 1",
    complex: "Kompleks 1",
    total: 40,
    occupied: 32,
    serviceFee: 25,
  },
  {
    id: 2,
    name: "A Blok - 2-ci giriş",
    building: "Bina 1",
    complex: "Kompleks 1",
    total: 28,
    occupied: 20,
    serviceFee: 30,
  },
  {
    id: 3,
    name: "B Blok - 1-ci giriş",
    building: "Bina 2",
    complex: "Kompleks 2",
    total: 36,
    occupied: 18,
    serviceFee: 22,
  },
];

export function useApartmentGroupsData(filters) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => {
      setData(mockGroups);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    if (!filters.complex && !filters.building) {
      return data;
    }

    return data.filter((group) => {
      const matchesComplex = !filters.complex || 
        group.complex.toLowerCase().includes(filters.complex.toLowerCase());
      const matchesBuilding = !filters.building || 
        group.building.toLowerCase().includes(filters.building.toLowerCase());
      
      return matchesComplex && matchesBuilding;
    });
  }, [data, filters]);

  // Calculate summary
  const summary = useMemo(() => {
    const totalGroups = filteredData.length;
    const totalApartments = filteredData.reduce((sum, group) => sum + group.total, 0);
    const occupied = filteredData.reduce((sum, group) => sum + group.occupied, 0);

    return {
      totalGroups,
      totalApartments,
      occupied,
    };
  }, [filteredData]);

  return {
    groups: filteredData,
    loading,
    summary,
  };
}

