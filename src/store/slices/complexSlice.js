import { createCrudEntitySlice } from './utils/createCrudEntitySlice';
import complexesAPI from '@/services/management/complexesApi';

const COOKIE_KEYS = {
  COMPLEX_ID: 'smartlife_complex_id',
};

const { slice, loadList, loadById } = createCrudEntitySlice({
  sliceName: 'complex',
  api: complexesAPI,
  cookieKey: COOKIE_KEYS.COMPLEX_ID,
  listStateKey: 'complexes',
  selectedIdStateKey: 'selectedComplexId',
  selectedItemStateKey: 'selectedComplex',
  selectedPayloadKey: 'complex',
  listThunkType: 'complex/loadComplexes',
  byIdThunkType: 'complex/loadComplexById',
  loadListErrorMessage: 'Failed to load Complexes',
  loadByIdErrorMessage: 'Failed to load Complex',
});

export const loadComplexes = loadList;
export const loadComplexById = loadById;
export const { setSelected: setSelectedComplex, clearSelected: clearSelectedComplex } = slice.actions;
export default slice.reducer;

