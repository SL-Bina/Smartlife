import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectManagement,
  selectMtk,
  selectMtkId,
  selectComplex,
  selectComplexId,
  selectBuilding,
  selectBuildingId,
  selectBlock,
  selectBlockId,
  selectProperty,
  selectPropertyId,
  selectResident,
  selectResidentId,
  selectStoredColorCode,
  selectMtks,
  selectComplexes,
  selectBuildings,
  selectBlocks,
  selectProperties,
  selectResidents,
  selectFilteredComplexes,
  selectFilteredBuildings,
  selectFilteredBlocks,
  selectFilters,
  selectLists,
  selectIndexedMaps,
  selectLoading,
  selectIsInitializing,
} from '../selectors';
import {
  resetAll,
  setMtk,
  setComplex,
  setBuilding,
  setBlock,
  setProperty,
  setResident,
  updateStoredColor,
  setFilter,
  setFilters,
  clearFilters,
  refreshList,
  loadEntityById,
} from '../slices/managementSlice';

export function useManagement() {
  const dispatch = useAppDispatch();

  const state = useAppSelector(selectManagement);
  const mtk = useAppSelector(selectMtk);
  const mtkId = useAppSelector(selectMtkId);
  const complex = useAppSelector(selectComplex);
  const complexId = useAppSelector(selectComplexId);
  const building = useAppSelector(selectBuilding);
  const buildingId = useAppSelector(selectBuildingId);
  const block = useAppSelector(selectBlock);
  const blockId = useAppSelector(selectBlockId);
  const property = useAppSelector(selectProperty);
  const propertyId = useAppSelector(selectPropertyId);
  const resident = useAppSelector(selectResident);
  const residentId = useAppSelector(selectResidentId);
  const storedColorCode = useAppSelector(selectStoredColorCode);
  const filters = useAppSelector(selectFilters);
  const listsState = useAppSelector(selectLists);
  const indexedMaps = useAppSelector(selectIndexedMaps);
  const loading = useAppSelector(selectLoading);
  const isInitializing = useAppSelector(selectIsInitializing);

  const mtks = useAppSelector(selectMtks);
  const complexes = useAppSelector(selectComplexes);
  const buildings = useAppSelector(selectBuildings);
  const blocks = useAppSelector(selectBlocks);
  const properties = useAppSelector(selectProperties);
  const residents = useAppSelector(selectResidents);
  const filteredComplexes = useAppSelector(selectFilteredComplexes);
  const filteredBuildings = useAppSelector(selectFilteredBuildings);
  const filteredBlocks = useAppSelector(selectFilteredBlocks);

  const actions = {
    resetAll: () => dispatch(resetAll()),
    setMtk: (id, data = null) => dispatch(setMtk({ id, data })),
    setComplex: (id, data = null) => dispatch(setComplex({ id, data })),
    setBuilding: (id, data = null) => dispatch(setBuilding({ id, data })),
    setBlock: (id, data = null) => dispatch(setBlock({ id, data })),
    setProperty: (id, data = null) => dispatch(setProperty({ id, data })),
    setResident: (id, data = null) => dispatch(setResident({ id, data })),
    updateStoredColor: (colorCode) => dispatch(updateStoredColor({ colorCode })),
    setFilter: (key, value) => dispatch(setFilter({ key, value })),
    setFilters: (filters) => dispatch(setFilters(filters)),
    clearFilters: () => dispatch(clearFilters()),
    refreshList: (key) => dispatch(refreshList(key)),
    loadEntityById: (type, id) => dispatch(loadEntityById({ type, id })),
  };

  return {
    state: {
      ...state,
      mtk,
      mtkId,
      complex,
      complexId,
      building,
      buildingId,
      block,
      blockId,
      property,
      propertyId,
      resident,
      residentId,
      storedColorCode,
      filters,
      lists: listsState,
      indexedMaps,
      loading,
      isInitializing,
      // Add arrays for backward compatibility
      mtks,
      complexes,
      buildings,
      blocks,
      properties,
      residents,
      filteredComplexes,
      filteredBuildings,
      filteredBlocks,
    },
    lists: {
      mtks,
      complexes,
      buildings,
      blocks,
      properties,
      residents,
      filteredComplexes,
      filteredBuildings,
      filteredBlocks,
    },
    actions,
  };
}

