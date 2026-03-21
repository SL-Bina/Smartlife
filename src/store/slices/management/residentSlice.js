import { createCrudEntitySlice } from '../utils/createCrudEntitySlice';
import { residentsAPI } from '@/services/management';

const COOKIE_KEYS = {
  RESIDENT_ID: 'smartlife_resident_id',
};

const { slice, loadList, loadById } = createCrudEntitySlice({
  sliceName: 'resident',
  api: residentsAPI,
  cookieKey: COOKIE_KEYS.RESIDENT_ID,
  listStateKey: 'residents',
  selectedIdStateKey: 'selectedResidentId',
  selectedItemStateKey: 'selectedResident',
  selectedPayloadKey: 'resident',
  listThunkType: 'resident/loadResidents',
  byIdThunkType: 'resident/loadResidentById',
  loadListErrorMessage: 'Failed to load Residents',
  loadByIdErrorMessage: 'Failed to load Resident',
  loadByIdAffectsLoading: true,
  onLoadByIdFulfilled: (state, payload) => {
    if (state.selectedResidentId !== payload.id) return;
    state.selectedResident = payload;
  },
});

export const loadResidents = loadList;
export const loadResidentById = loadById;
export const { setSelected: setSelectedResident, clearSelected: clearSelectedResident } = slice.actions;
export default slice.reducer;

