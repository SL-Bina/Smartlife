import { createCrudEntitySlice } from './utils/createCrudEntitySlice';
import blocksAPI from '@/services/management/blocksApi';

const COOKIE_KEYS = {
  BLOCK_ID: 'smartlife_block_id',
};

const { slice, loadList, loadById } = createCrudEntitySlice({
  sliceName: 'block',
  api: blocksAPI,
  cookieKey: COOKIE_KEYS.BLOCK_ID,
  listStateKey: 'blocks',
  selectedIdStateKey: 'selectedBlockId',
  selectedItemStateKey: 'selectedBlock',
  selectedPayloadKey: 'block',
  listThunkType: 'block/loadBlocks',
  byIdThunkType: 'block/loadBlockById',
  loadListErrorMessage: 'Failed to load Blocks',
  loadByIdErrorMessage: 'Failed to load Block',
});

export const loadBlocks = loadList;
export const loadBlockById = loadById;
export const { setSelected: setSelectedBlock, clearSelected: clearSelectedBlock } = slice.actions;
export default slice.reducer;

