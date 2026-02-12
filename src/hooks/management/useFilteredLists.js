/**
 * Frontend Filter Logic Hooks
 * 
 * Bu hook-lar backend filter olmadan frontend-də filtering, searching,
 * sorting və pagination təmin edir.
 */

import { useMemo } from "react";
import { extractRelationshipId } from "@/utils/management/normalization";

/**
 * Filter complexes by MTK
 */
export function useFilteredComplexes(complexes, filters) {
  return useMemo(() => {
    if (!Array.isArray(complexes)) return [];

    return complexes.filter((complex) => {
      // MTK filter
      if (filters.mtkId) {
        const complexMtkId = extractRelationshipId(complex, 'mtk');
        if (complexMtkId !== filters.mtkId) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = complex.name?.toLowerCase().includes(searchLower);
        const matchesAddress = complex.meta?.address?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesAddress) return false;
      }

      // Status filter
      if (filters.status) {
        if (complex.status !== filters.status) return false;
      }

      return true;
    });
  }, [complexes, filters.mtkId, filters.search, filters.status]);
}

/**
 * Filter buildings by Complex and MTK
 */
export function useFilteredBuildings(buildings, filters) {
  return useMemo(() => {
    if (!Array.isArray(buildings)) return [];

    return buildings.filter((building) => {
      // Complex filter
      if (filters.complexId) {
        const buildingComplexId = extractRelationshipId(building, 'complex');
        if (buildingComplexId !== filters.complexId) return false;
      }

      // MTK filter (through complex)
      if (filters.mtkId) {
        const buildingMtkId = extractRelationshipId(building, 'mtk');
        if (buildingMtkId !== filters.mtkId) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = building.name?.toLowerCase().includes(searchLower);
        if (!matchesName) return false;
      }

      // Status filter
      if (filters.status) {
        if (building.status !== filters.status) return false;
      }

      return true;
    });
  }, [buildings, filters.complexId, filters.mtkId, filters.search, filters.status]);
}

/**
 * Filter blocks by Building, Complex, and MTK
 */
export function useFilteredBlocks(blocks, filters) {
  return useMemo(() => {
    if (!Array.isArray(blocks)) return [];

    return blocks.filter((block) => {
      // Building filter
      if (filters.buildingId) {
        const blockBuildingId = extractRelationshipId(block, 'building');
        if (blockBuildingId !== filters.buildingId) return false;
      }

      // Complex filter
      if (filters.complexId) {
        const blockComplexId = extractRelationshipId(block, 'complex');
        if (blockComplexId !== filters.complexId) return false;
      }

      // MTK filter (through complex)
      if (filters.mtkId) {
        const blockMtkId = extractRelationshipId(block, 'mtk');
        if (blockMtkId !== filters.mtkId) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = block.name?.toLowerCase().includes(searchLower);
        if (!matchesName) return false;
      }

      // Status filter
      if (filters.status) {
        if (block.status !== filters.status) return false;
      }

      return true;
    });
  }, [blocks, filters.buildingId, filters.complexId, filters.mtkId, filters.search, filters.status]);
}

/**
 * Filter properties by Block, Building, Complex, and MTK
 * Uses sub_data as source of truth
 */
export function useFilteredProperties(properties, filters) {
  return useMemo(() => {
    if (!Array.isArray(properties)) return [];

    return properties.filter((property) => {
      // Block filter (highest priority)
      if (filters.blockId) {
        const propertyBlockId = extractRelationshipId(property, 'block');
        if (propertyBlockId !== filters.blockId) return false;
      }

      // Building filter
      if (filters.buildingId) {
        const propertyBuildingId = extractRelationshipId(property, 'building');
        if (propertyBuildingId !== filters.buildingId) return false;
      }

      // Complex filter
      if (filters.complexId) {
        const propertyComplexId = extractRelationshipId(property, 'complex');
        if (propertyComplexId !== filters.complexId) return false;
      }

      // MTK filter
      if (filters.mtkId) {
        const propertyMtkId = extractRelationshipId(property, 'mtk');
        if (propertyMtkId !== filters.mtkId) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = property.name?.toLowerCase().includes(searchLower);
        const matchesNumber = property.meta?.apartment_number?.toString().includes(searchLower);
        if (!matchesName && !matchesNumber) return false;
      }

      // Status filter
      if (filters.status) {
        if (property.status !== filters.status) return false;
      }

      return true;
    });
  }, [
    properties,
    filters.blockId,
    filters.buildingId,
    filters.complexId,
    filters.mtkId,
    filters.search,
    filters.status,
  ]);
}

/**
 * Generic sorted list hook
 */
export function useSortedList(list, sortConfig) {
  return useMemo(() => {
    if (!Array.isArray(list) || !sortConfig?.key) return list;

    return [...list].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "name":
          aValue = (a.name || "").toLowerCase();
          bValue = (b.name || "").toLowerCase();
          break;
        case "status":
          aValue = (a.status || "").toLowerCase();
          bValue = (b.status || "").toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [list, sortConfig]);
}

/**
 * Generic paginated list hook
 */
export function usePaginatedList(list, page = 1, itemsPerPage = 10) {
  return useMemo(() => {
    if (!Array.isArray(list)) return { items: [], totalPages: 0, totalItems: 0 };

    const totalItems = list.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const items = list.slice(startIndex, endIndex);

    return {
      items,
      totalPages,
      totalItems,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }, [list, page, itemsPerPage]);
}

/**
 * Combined filter + sort + pagination hook
 */
export function useProcessedList({
  list,
  filters,
  sortConfig,
  page,
  itemsPerPage,
  filterFn,
}) {
  const filtered = useMemo(() => {
    if (!Array.isArray(list)) return [];
    if (!filterFn) return list;
    return filterFn(list, filters);
  }, [list, filters, filterFn]);

  const sorted = useSortedList(filtered, sortConfig);
  const paginated = usePaginatedList(sorted, page, itemsPerPage);

  return {
    ...paginated,
    filteredCount: filtered.length,
    allItems: sorted, // For export, etc.
  };
}







