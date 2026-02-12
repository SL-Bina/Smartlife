/**
 * Selector Hooks for Management Context
 * 
 * Bu hook-lar indexed maps-dən istifadə edərək sürətli filtering təmin edir.
 * Böyük data üçün performans optimallaşdırması.
 */

import { useMemo } from "react";
import { useManagementEnhanced } from "@/store/exports";

/**
 * Get complexes filtered by MTK using indexed maps
 */
export function useComplexesByMtk(mtkId) {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    if (!mtkId || !state.indexedMaps.complexIdsByMtkId[mtkId]) {
      return [];
    }

    const complexIds = state.indexedMaps.complexIdsByMtkId[mtkId];
    return complexIds
      .map((id) => state.lists.complexes.entities[id])
      .filter(Boolean);
  }, [mtkId, state.indexedMaps.complexIdsByMtkId, state.lists.complexes.entities]);
}

/**
 * Get buildings filtered by Complex using indexed maps
 */
export function useBuildingsByComplex(complexId) {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    if (!complexId || !state.indexedMaps.buildingIdsByComplexId[complexId]) {
      return [];
    }

    const buildingIds = state.indexedMaps.buildingIdsByComplexId[complexId];
    return buildingIds
      .map((id) => state.lists.buildings.entities[id])
      .filter(Boolean);
  }, [complexId, state.indexedMaps.buildingIdsByComplexId, state.lists.buildings.entities]);
}

/**
 * Get buildings filtered by MTK using indexed maps
 */
export function useBuildingsByMtk(mtkId) {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    if (!mtkId || !state.indexedMaps.buildingIdsByMtkId[mtkId]) {
      return [];
    }

    const buildingIds = state.indexedMaps.buildingIdsByMtkId[mtkId];
    return buildingIds
      .map((id) => state.lists.buildings.entities[id])
      .filter(Boolean);
  }, [mtkId, state.indexedMaps.buildingIdsByMtkId, state.lists.buildings.entities]);
}

/**
 * Get blocks filtered by Building using indexed maps
 */
export function useBlocksByBuilding(buildingId) {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    if (!buildingId || !state.indexedMaps.blockIdsByBuildingId[buildingId]) {
      return [];
    }

    const blockIds = state.indexedMaps.blockIdsByBuildingId[buildingId];
    return blockIds
      .map((id) => state.lists.blocks.entities[id])
      .filter(Boolean);
  }, [buildingId, state.indexedMaps.blockIdsByBuildingId, state.lists.blocks.entities]);
}

/**
 * Get blocks filtered by Complex using indexed maps
 */
export function useBlocksByComplex(complexId) {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    if (!complexId || !state.indexedMaps.blockIdsByComplexId[complexId]) {
      return [];
    }

    const blockIds = state.indexedMaps.blockIdsByComplexId[complexId];
    return blockIds
      .map((id) => state.lists.blocks.entities[id])
      .filter(Boolean);
  }, [complexId, state.indexedMaps.blockIdsByComplexId, state.lists.blocks.entities]);
}

/**
 * Get blocks filtered by MTK using indexed maps
 */
export function useBlocksByMtk(mtkId) {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    if (!mtkId || !state.indexedMaps.blockIdsByMtkId[mtkId]) {
      return [];
    }

    const blockIds = state.indexedMaps.blockIdsByMtkId[mtkId];
    return blockIds
      .map((id) => state.lists.blocks.entities[id])
      .filter(Boolean);
  }, [mtkId, state.indexedMaps.blockIdsByMtkId, state.lists.blocks.entities]);
}

/**
 * Get properties filtered by Block using indexed maps
 */
export function usePropertiesByBlock(blockId) {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    if (!blockId || !state.indexedMaps.propertyIdsByBlockId[blockId]) {
      return [];
    }

    const propertyIds = state.indexedMaps.propertyIdsByBlockId[blockId];
    return propertyIds
      .map((id) => state.lists.properties.entities[id])
      .filter(Boolean);
  }, [blockId, state.indexedMaps.propertyIdsByBlockId, state.lists.properties.entities]);
}

/**
 * Get properties filtered by Building using indexed maps
 */
export function usePropertiesByBuilding(buildingId) {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    if (!buildingId || !state.indexedMaps.propertyIdsByBuildingId[buildingId]) {
      return [];
    }

    const propertyIds = state.indexedMaps.propertyIdsByBuildingId[buildingId];
    return propertyIds
      .map((id) => state.lists.properties.entities[id])
      .filter(Boolean);
  }, [buildingId, state.indexedMaps.propertyIdsByBuildingId, state.lists.properties.entities]);
}

/**
 * Get properties filtered by Complex using indexed maps
 */
export function usePropertiesByComplex(complexId) {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    if (!complexId || !state.indexedMaps.propertyIdsByComplexId[complexId]) {
      return [];
    }

    const propertyIds = state.indexedMaps.propertyIdsByComplexId[complexId];
    return propertyIds
      .map((id) => state.lists.properties.entities[id])
      .filter(Boolean);
  }, [complexId, state.indexedMaps.propertyIdsByComplexId, state.lists.properties.entities]);
}

/**
 * Get properties filtered by MTK using indexed maps
 */
export function usePropertiesByMtk(mtkId) {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    if (!mtkId || !state.indexedMaps.propertyIdsByMtkId[mtkId]) {
      return [];
    }

    const propertyIds = state.indexedMaps.propertyIdsByMtkId[mtkId];
    return propertyIds
      .map((id) => state.lists.properties.entities[id])
      .filter(Boolean);
  }, [mtkId, state.indexedMaps.propertyIdsByMtkId, state.lists.properties.entities]);
}

/**
 * Get all available filter options based on current filters
 * Returns cascaded options (e.g., if MTK selected, only show complexes for that MTK)
 * 
 * Note: This hook doesn't use other hooks inside useMemo to avoid hook rules violation.
 * Instead, it directly accesses indexed maps.
 */
export function useFilterOptions() {
  const { state } = useManagementEnhanced();
  
  return useMemo(() => {
    const { filters, lists, indexedMaps } = state;

    // MTKs - always show all
    const mtks = lists.mtks.ids.map((id) => lists.mtks.entities[id]).filter(Boolean);

    // Complexes - filtered by MTK if selected
    let complexes = [];
    if (filters.mtkId && indexedMaps.complexIdsByMtkId[filters.mtkId]) {
      const complexIds = indexedMaps.complexIdsByMtkId[filters.mtkId];
      complexes = complexIds
        .map((id) => lists.complexes.entities[id])
        .filter(Boolean);
    } else {
      complexes = lists.complexes.ids.map((id) => lists.complexes.entities[id]).filter(Boolean);
    }

    // Buildings - filtered by Complex or MTK if selected
    let buildings = [];
    if (filters.complexId && indexedMaps.buildingIdsByComplexId[filters.complexId]) {
      const buildingIds = indexedMaps.buildingIdsByComplexId[filters.complexId];
      buildings = buildingIds
        .map((id) => lists.buildings.entities[id])
        .filter(Boolean);
    } else if (filters.mtkId && indexedMaps.buildingIdsByMtkId[filters.mtkId]) {
      const buildingIds = indexedMaps.buildingIdsByMtkId[filters.mtkId];
      buildings = buildingIds
        .map((id) => lists.buildings.entities[id])
        .filter(Boolean);
    } else {
      buildings = lists.buildings.ids.map((id) => lists.buildings.entities[id]).filter(Boolean);
    }

    // Blocks - filtered by Building, Complex, or MTK if selected
    let blocks = [];
    if (filters.buildingId && indexedMaps.blockIdsByBuildingId[filters.buildingId]) {
      const blockIds = indexedMaps.blockIdsByBuildingId[filters.buildingId];
      blocks = blockIds
        .map((id) => lists.blocks.entities[id])
        .filter(Boolean);
    } else if (filters.complexId && indexedMaps.blockIdsByComplexId[filters.complexId]) {
      const blockIds = indexedMaps.blockIdsByComplexId[filters.complexId];
      blocks = blockIds
        .map((id) => lists.blocks.entities[id])
        .filter(Boolean);
    } else if (filters.mtkId && indexedMaps.blockIdsByMtkId[filters.mtkId]) {
      const blockIds = indexedMaps.blockIdsByMtkId[filters.mtkId];
      blocks = blockIds
        .map((id) => lists.blocks.entities[id])
        .filter(Boolean);
    } else {
      blocks = lists.blocks.ids.map((id) => lists.blocks.entities[id]).filter(Boolean);
    }

    return {
      mtks,
      complexes,
      buildings,
      blocks,
    };
  }, [state.filters, state.lists, state.indexedMaps]);
}

