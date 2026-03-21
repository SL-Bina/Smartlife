import { createCrudEntitySlice } from './utils/createCrudEntitySlice';
import propertiesAPI from '@/services/management/propertiesApi';

const COOKIE_KEYS = {
  PROPERTY_ID: 'smartlife_property_id',
};

const LS_PROPERTY_KEY = 'smartlife_selected_property';

const getStoredProperty = () => {
  try {
    const raw = localStorage.getItem(LS_PROPERTY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const savePropertyToStorage = (property) => {
  try {
    if (property) {
      localStorage.setItem(LS_PROPERTY_KEY, JSON.stringify(property));
    } else {
      localStorage.removeItem(LS_PROPERTY_KEY);
    }
  } catch {
    // ignore
  }
};

const { slice, loadList, loadById } = createCrudEntitySlice({
  sliceName: 'property',
  api: propertiesAPI,
  cookieKey: COOKIE_KEYS.PROPERTY_ID,
  listStateKey: 'properties',
  selectedIdStateKey: 'selectedPropertyId',
  selectedItemStateKey: 'selectedProperty',
  selectedPayloadKey: 'property',
  listThunkType: 'property/loadProperties',
  byIdThunkType: 'property/loadPropertyById',
  loadListErrorMessage: 'Failed to load Properties',
  loadByIdErrorMessage: 'Failed to load Property',
  getInitialSelectedItem: getStoredProperty,
  persistSelectedItem: {
    set: savePropertyToStorage,
    clear: () => savePropertyToStorage(null),
  },
});

export const loadProperties = loadList;
export const loadPropertyById = loadById;
export const { setSelected: setSelectedProperty, clearSelected: clearSelectedProperty } = slice.actions;
export default slice.reducer;

