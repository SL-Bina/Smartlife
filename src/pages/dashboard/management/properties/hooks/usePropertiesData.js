import { useState, useEffect, useMemo } from "react";

// Hər mərtəbədə 5 mənzil olacaq şəkildə data yaradırıq
// 50 mənzil = 10 mərtəbə (hər mərtəbədə 5 mənzil)
const TOTAL_APARTMENTS = 50;
const APARTMENTS_PER_FLOOR = 5;
const TOTAL_FLOORS = Math.ceil(TOTAL_APARTMENTS / APARTMENTS_PER_FLOOR);

const generateData = () => {
  return Array.from({ length: TOTAL_APARTMENTS }, (_, index) => {
    const floor = Math.floor(index / APARTMENTS_PER_FLOOR) + 1; // 1-ci mərtəbə: 0-4, 2-ci mərtəbə: 5-9, ...
    const apartmentInFloor = (index % APARTMENTS_PER_FLOOR) + 1; // Mərtəbə daxilində mənzil nömrəsi (1-5)
    const blockIndex = Math.floor(index / (APARTMENTS_PER_FLOOR * TOTAL_FLOORS / 5)) % 5; // 5 blok
    
    return {
      id: index + 1,
      number: `Mənzil ${floor}${String(apartmentInFloor).padStart(2, '0')}`, // Məs: Mənzil 101, Mənzil 102, ...
      block: `Blok ${String.fromCharCode(65 + blockIndex)}`, // Blok A, B, C, D, E
      floor: floor,
      area: 60 + (index % 10) * 5, // 60-105 m² arası
      resident: `Sakin ${index + 1}`,
      serviceFee: 20 + (index % 6) * 2, // 20-30 arası
    };
  });
};

// Mənzilləri mərtəbələrə görə qruplaşdırırıq
const groupByFloor = (properties) => {
  const grouped = {};
  properties.forEach((prop) => {
    if (!grouped[prop.floor]) {
      grouped[prop.floor] = [];
    }
    grouped[prop.floor].push(prop);
  });
  return grouped;
};

// Hər mərtəbədə 5 mənzil olacaq şəkildə qruplaşdırırıq
const organizeByFloors = (properties, ascending = true) => {
  const grouped = groupByFloor(properties);
  const floors = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => ascending ? a - b : b - a); // Sıralama istiqaməti
  
  const organized = [];
  floors.forEach((floor) => {
    const floorProperties = grouped[floor];
    // Hər mərtəbədə tam 5 mənzil olacaq şəkildə bölürük
    for (let i = 0; i < floorProperties.length; i += 5) {
      const apartments = floorProperties.slice(i, i + 5);
      // Əgər 5-dən az mənzil qalıbsa, boş yerləri null ilə doldururuq
      while (apartments.length < 5) {
        apartments.push(null);
      }
      organized.push({
        floor,
        apartments: apartments.slice(0, 5), // Həmişə 5 mənzil
      });
    }
  });
  
  return organized;
};

export function usePropertiesData(filters, sortAscending) {
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
    if (!filters.number && !filters.block) {
      return data;
    }

    return data.filter((property) => {
      const matchesNumber = !filters.number || 
        property.number.toLowerCase().includes(filters.number.toLowerCase());
      const matchesBlock = !filters.block || 
        property.block.toLowerCase().includes(filters.block.toLowerCase());
      
      return matchesNumber && matchesBlock;
    });
  }, [data, filters]);

  // Organize by floors
  const organizedData = useMemo(() => {
    return organizeByFloors(filteredData, sortAscending);
  }, [filteredData, sortAscending]);

  return {
    properties: filteredData,
    organizedData,
    loading,
  };
}

