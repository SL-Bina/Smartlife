import { createCrudEntitySlice } from './utils/createCrudEntitySlice';
import { getCookie, setCookie, removeCookie } from './utils/cookieUtils';
import mtkAPI from '@/services/management/mtkApi';

const COOKIE_KEYS = {
  MTK_ID: 'smartlife_mtk_id',
  MTK_COLOR_CODE: 'smartlife_mtk_color_code',
};

const { slice, loadList, loadById } = createCrudEntitySlice({
  sliceName: 'mtk',
  api: mtkAPI,
  cookieKey: COOKIE_KEYS.MTK_ID,
  listStateKey: 'mtks',
  selectedIdStateKey: 'selectedMtkId',
  selectedItemStateKey: 'selectedMtk',
  selectedPayloadKey: 'mtk',
  listThunkType: 'mtk/loadMtks',
  byIdThunkType: 'mtk/loadMtkById',
  loadListErrorMessage: 'Failed to load MTKs',
  loadByIdErrorMessage: 'Failed to load MTK',
  additionalInitialState: {
    storedColorCode: getCookie(COOKIE_KEYS.MTK_COLOR_CODE),
  },
  additionalReducers: {
    updateStoredColor: (state, action) => {
      const { colorCode } = action.payload;
      if (!colorCode) return;
      state.storedColorCode = colorCode;
      setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);
    },
  },
  onSetSelected: (state, { id, selectedItem }) => {
    const colorCode = selectedItem?.meta?.color_code || null;
    if (colorCode) {
      state.storedColorCode = colorCode;
      setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);
    }
    if (!id) {
      removeCookie(COOKIE_KEYS.MTK_COLOR_CODE);
    }
  },
  onClearSelected: (state) => {
    state.storedColorCode = null;
    removeCookie(COOKIE_KEYS.MTK_COLOR_CODE);
  },
  onLoadByIdFulfilled: (state, payload) => {
    const colorCode = payload?.meta?.color_code;
    if (!colorCode) return;
    state.storedColorCode = colorCode;
    setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);
  },
});

export const loadMtks = loadList;
export const loadMtkById = loadById;
export const {
  setSelected: setSelectedMtk,
  clearSelected: clearSelectedMtk,
  updateStoredColor,
} = slice.actions;
export default slice.reducer;

