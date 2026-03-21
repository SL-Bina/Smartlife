import { buildingsAPI } from '@/services/management';
import { createCrudEntitySlice } from '../utils/createCrudEntitySlice';

const COOKIE_KEYS = {
  BUILDING_ID: 'smartlife_building_id',
};

const { slice, loadList, loadById } = createCrudEntitySlice({
  sliceName: 'building',
  api: buildingsAPI,
  cookieKey: COOKIE_KEYS.BUILDING_ID,
  listStateKey: 'buildings',
  selectedIdStateKey: 'selectedBuildingId',
  selectedItemStateKey: 'selectedBuilding',
  selectedPayloadKey: 'building',
  listThunkType: 'building/loadBuildings',
  byIdThunkType: 'building/loadBuildingById',
  loadListErrorMessage: 'Failed to load Buildings',
  loadByIdErrorMessage: 'Failed to load Building',
});

export const loadBuildings = loadList;
export const loadBuildingById = loadById;
export const { setSelected: setSelectedBuilding, clearSelected: clearSelectedBuilding } = slice.actions;
export default slice.reducer;

