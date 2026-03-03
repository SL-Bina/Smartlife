import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setSelectedMtk, loadMtkById } from "@/store/slices/mtkSlice";
import { setSelectedComplex, loadComplexById } from "@/store/slices/complexSlice";
import { setSelectedBuilding, loadBuildingById } from "@/store/slices/buildingSlice";
import { setSelectedBlock, loadBlockById } from "@/store/slices/blockSlice";
import { setSelectedProperty, loadPropertyById } from "@/store/slices/propertySlice";

export function useManagementFilters() {
  const dispatch = useAppDispatch();

  const mtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const complexId = useAppSelector((state) => state.complex.selectedComplexId);
  const buildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const blockId = useAppSelector((state) => state.block.selectedBlockId);
  const propertyId = useAppSelector((state) => state.property.selectedPropertyId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);
  const selectedBuilding = useAppSelector((state) => state.building.selectedBuilding);
  const selectedBlock = useAppSelector((state) => state.block.selectedBlock);
  const selectedProperty = useAppSelector((state) => state.property.selectedProperty);
  const setFilter = async (filterType, value) => {
    switch (filterType) {
      case "mtk":
        if (value) {
          const result = await dispatch(loadMtkById(value));
          if (result.payload) {
            dispatch(setSelectedMtk({ id: value, mtk: result.payload }));
          }
        } else {
          dispatch(setSelectedMtk({ id: null, mtk: null }));
          dispatch(setSelectedComplex({ id: null, complex: null }));
          dispatch(setSelectedBuilding({ id: null, building: null }));
          dispatch(setSelectedBlock({ id: null, block: null }));
          dispatch(setSelectedProperty({ id: null, property: null }));
        }
        break;

      case "complex":
        if (value) {
          const result = await dispatch(loadComplexById(value));
          if (result.payload) {
            dispatch(setSelectedComplex({ id: value, complex: result.payload }));
          }
        } else {
          dispatch(setSelectedComplex({ id: null, complex: null }));
          dispatch(setSelectedBuilding({ id: null, building: null }));
          dispatch(setSelectedBlock({ id: null, block: null }));
          dispatch(setSelectedProperty({ id: null, property: null }));
        }
        break;

      case "building":
        if (value) {
          const result = await dispatch(loadBuildingById(value));
          if (result.payload) {
            dispatch(setSelectedBuilding({ id: value, building: result.payload }));
          }
        } else {
          dispatch(setSelectedBuilding({ id: null, building: null }));
          dispatch(setSelectedBlock({ id: null, block: null }));
          dispatch(setSelectedProperty({ id: null, property: null }));
        }
        break;

      case "block":
        if (value) {
          const result = await dispatch(loadBlockById(value));
          if (result.payload) {
            dispatch(setSelectedBlock({ id: value, block: result.payload }));
          }
        } else {
          dispatch(setSelectedBlock({ id: null, block: null }));
          dispatch(setSelectedProperty({ id: null, property: null }));
        }
        break;

      case "property":
        if (value) {
          const result = await dispatch(loadPropertyById(value));
          if (result.payload) {
            dispatch(setSelectedProperty({ id: value, property: result.payload }));
          }
        } else {
          dispatch(setSelectedProperty({ id: null, property: null }));
        }
        break;

      default:
        break;
    }
  };

  const clearAllFilters = () => {
    dispatch(setSelectedMtk({ id: null, mtk: null }));
    dispatch(setSelectedComplex({ id: null, complex: null }));
    dispatch(setSelectedBuilding({ id: null, building: null }));
    dispatch(setSelectedBlock({ id: null, block: null }));
    dispatch(setSelectedProperty({ id: null, property: null }));
  };

  return {
    mtkId,
    complexId,
    buildingId,
    blockId,
    propertyId,
    selectedMtk,
    selectedComplex,
    selectedBuilding,
    selectedBlock,
    selectedProperty,
    setFilter,
    clearAllFilters,
  };
}
