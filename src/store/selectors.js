import { createSelector } from '@reduxjs/toolkit';

// Base selectors
export const selectManagement = (state) => state.management;
export const selectFilters = (state) => state.management.filters;
export const selectLists = (state) => state.management.lists;
export const selectIndexedMaps = (state) => state.management.indexedMaps;
export const selectLoading = (state) => state.management.loading;
export const selectIsInitializing = (state) => state.management.isInitializing;

// Selected entities
export const selectMtk = (state) => state.management.mtk;
export const selectMtkId = (state) => state.management.mtkId;
export const selectComplex = (state) => state.management.complex;
export const selectComplexId = (state) => state.management.complexId;
export const selectBuilding = (state) => state.management.building;
export const selectBuildingId = (state) => state.management.buildingId;
export const selectBlock = (state) => state.management.block;
export const selectBlockId = (state) => state.management.blockId;
export const selectProperty = (state) => state.management.property;
export const selectPropertyId = (state) => state.management.propertyId;
export const selectResident = (state) => state.management.resident;
export const selectResidentId = (state) => state.management.residentId;
export const selectStoredColorCode = (state) => state.management.storedColorCode;

// Memoized selectors
export const selectMtks = createSelector([selectLists], (lists) => {
  return lists.mtks.ids.map((id) => lists.mtks.entities[id]);
});

export const selectComplexes = createSelector([selectLists], (lists) => {
  return lists.complexes.ids.map((id) => lists.complexes.entities[id]);
});

export const selectBuildings = createSelector([selectLists], (lists) => {
  return lists.buildings.ids.map((id) => lists.buildings.entities[id]);
});

export const selectBlocks = createSelector([selectLists], (lists) => {
  return lists.blocks.ids.map((id) => lists.blocks.entities[id]);
});

export const selectProperties = createSelector([selectLists], (lists) => {
  return lists.properties.ids.map((id) => lists.properties.entities[id]);
});

export const selectResidents = createSelector([selectLists], (lists) => {
  return lists.residents.ids.map((id) => lists.residents.entities[id]);
});

// Filtered selectors
export const selectFilteredComplexes = createSelector(
  [selectComplexes, selectMtkId, selectIndexedMaps],
  (complexes, mtkId, indexedMaps) => {
    if (!mtkId) return complexes;
    const complexIds = indexedMaps.complexIdsByMtkId[mtkId] || [];
    return complexIds.map((id) => {
      const complex = complexes.find((c) => c.id === id);
      return complex;
    }).filter(Boolean);
  }
);

export const selectFilteredBuildings = createSelector(
  [selectBuildings, selectComplexId, selectMtkId, selectIndexedMaps],
  (buildings, complexId, mtkId, indexedMaps) => {
    if (complexId) {
      const buildingIds = indexedMaps.buildingIdsByComplexId[complexId] || [];
      return buildingIds.map((id) => {
        const building = buildings.find((b) => b.id === id);
        return building;
      }).filter(Boolean);
    }
    if (mtkId) {
      const buildingIds = indexedMaps.buildingIdsByMtkId[mtkId] || [];
      return buildingIds.map((id) => {
        const building = buildings.find((b) => b.id === id);
        return building;
      }).filter(Boolean);
    }
    return buildings;
  }
);

export const selectFilteredBlocks = createSelector(
  [selectBlocks, selectBuildingId, selectComplexId, selectMtkId, selectIndexedMaps],
  (blocks, buildingId, complexId, mtkId, indexedMaps) => {
    if (buildingId) {
      const blockIds = indexedMaps.blockIdsByBuildingId[buildingId] || [];
      return blockIds.map((id) => {
        const block = blocks.find((b) => b.id === id);
        return block;
      }).filter(Boolean);
    }
    if (complexId) {
      const blockIds = indexedMaps.blockIdsByComplexId[complexId] || [];
      return blockIds.map((id) => {
        const block = blocks.find((b) => b.id === id);
        return block;
      }).filter(Boolean);
    }
    if (mtkId) {
      const blockIds = indexedMaps.blockIdsByMtkId[mtkId] || [];
      return blockIds.map((id) => {
        const block = blocks.find((b) => b.id === id);
        return block;
      }).filter(Boolean);
    }
    return blocks;
  }
);


