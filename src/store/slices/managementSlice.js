import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { normalizeAllLists, buildIndexedMaps } from '@/utils/management/normalization';
import mtkAPI from '@/pages/dashboard/management/mtk/api';
import complexAPI from '@/pages/dashboard/management/complex/api';
import buildingAPI from '@/pages/dashboard/management/buildings/api';
import blockAPI from '@/pages/dashboard/management/blocks/api';
import propertiesAPI from '@/pages/dashboard/management/properties/api';
import { fetchResidents, fetchResidentById } from '@/pages/dashboard/management/residents/api';

// Cookie keys
const COOKIE_KEYS = {
  MTK_ID: 'smartlife_mtk_id',
  MTK_COLOR_CODE: 'smartlife_mtk_color_code',
  COMPLEX_ID: 'smartlife_complex_id',
  BUILDING_ID: 'smartlife_building_id',
  BLOCK_ID: 'smartlife_block_id',
  PROPERTY_ID: 'smartlife_property_id',
  RESIDENT_ID: 'smartlife_resident_id',
};

// Cookie utilities
const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  } catch (e) {
    console.error(`Error reading cookie ${name}:`, e);
    return null;
  }
};

const setCookie = (name, value, days = 365) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  } catch (e) {
    console.error(`Error writing cookie ${name}:`, e);
  }
};

const removeCookie = (name) => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  } catch (e) {
    console.error(`Error removing cookie ${name}:`, e);
  }
};

const getStoredId = (key) => {
  const id = getCookie(key);
  return id ? parseInt(id, 10) : null;
};

// Initial state
const initialState = {
  // Selected entities
  mtkId: getStoredId(COOKIE_KEYS.MTK_ID),
  mtk: null,
  complexId: getStoredId(COOKIE_KEYS.COMPLEX_ID),
  complex: null,
  buildingId: getStoredId(COOKIE_KEYS.BUILDING_ID),
  building: null,
  blockId: getStoredId(COOKIE_KEYS.BLOCK_ID),
  block: null,
  propertyId: getStoredId(COOKIE_KEYS.PROPERTY_ID),
  property: null,
  residentId: getStoredId(COOKIE_KEYS.RESIDENT_ID),
  resident: null,
  storedColorCode: getCookie(COOKIE_KEYS.MTK_COLOR_CODE),

  // Filters
  filters: {
    mtkId: null,
    complexId: null,
    buildingId: null,
    blockId: null,
    propertyId: null,
    residentId: null,
    search: '',
    status: null,
  },

  // Lists (normalized entities)
  lists: {
    mtks: { entities: {}, ids: [] },
    complexes: { entities: {}, ids: [] },
    buildings: { entities: {}, ids: [] },
    blocks: { entities: {}, ids: [] },
    properties: { entities: {}, ids: [] },
    residents: { entities: {}, ids: [] },
  },

  // Indexed maps for fast filtering
  indexedMaps: {
    complexIdsByMtkId: {},
    buildingIdsByComplexId: {},
    buildingIdsByMtkId: {},
    blockIdsByBuildingId: {},
    blockIdsByComplexId: {},
    blockIdsByMtkId: {},
    propertyIdsByBlockId: {},
    propertyIdsByBuildingId: {},
    propertyIdsByComplexId: {},
    propertyIdsByMtkId: {},
    residentIdsByPropertyId: {},
    residentIdsByBlockId: {},
    residentIdsByBuildingId: {},
    residentIdsByComplexId: {},
    residentIdsByMtkId: {},
  },

  // Loading states
  loading: {
    mtks: false,
    complexes: false,
    buildings: false,
    blocks: false,
    properties: false,
    residents: false,
  },

  isInitializing: true,
};

// Async thunks
export const loadAllLists = createAsyncThunk(
  'management/loadAllLists',
  async (_, { rejectWithValue }) => {
    try {
      const [mtkRes, complexRes, buildingRes, blockRes, propertyRes, residentsRes] = await Promise.all([
        mtkAPI.getAll({ page: 1, per_page: 1000 }),
        complexAPI.getAll({ page: 1, per_page: 1000 }),
        buildingAPI.getAll({ page: 1, per_page: 1000 }),
        blockAPI.getAll({ page: 1, per_page: 1000 }),
        propertiesAPI.getAll({ page: 1, per_page: 1000 }),
        fetchResidents({}, 1, 1000).catch(() => ({ data: [] })),
      ]);

      return {
        mtks: mtkRes?.data?.data || [],
        complexes: complexRes?.data?.data || [],
        buildings: buildingRes?.data?.data || [],
        blocks: blockRes?.data?.data || [],
        properties: propertyRes?.data?.data || [],
        residents: residentsRes?.data || [],
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshList = createAsyncThunk(
  'management/refreshList',
  async (key, { rejectWithValue }) => {
    try {
      const apiMap = {
        mtks: mtkAPI,
        complexes: complexAPI,
        buildings: buildingAPI,
        blocks: blockAPI,
        properties: propertiesAPI,
        residents: { getAll: async () => await fetchResidents({}, 1, 1000) },
      };

      const api = apiMap[key];
      if (!api) throw new Error(`Unknown list key: ${key}`);

      const res = await api.getAll({ page: 1, per_page: 1000 });
      return { key, list: res?.data?.data || res?.data || [] };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadEntityById = createAsyncThunk(
  'management/loadEntityById',
  async ({ type, id }, { rejectWithValue }) => {
    try {
      const apiMap = {
        mtk: mtkAPI,
        complex: complexAPI,
        building: buildingAPI,
        block: blockAPI,
        property: propertiesAPI,
        resident: { getById: fetchResidentById },
      };

      const api = apiMap[type];
      if (!api) throw new Error(`Unknown entity type: ${type}`);

      const res = await api.getById(id);
      return { type, id, data: res?.data || res || null };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const managementSlice = createSlice({
  name: 'management',
  initialState,
  reducers: {
    resetAll: (state) => {
      Object.values(COOKIE_KEYS).forEach((key) => removeCookie(key));
      return { ...initialState, isInitializing: false };
    },

    setMtk: (state, action) => {
      const { id, data } = action.payload || {};
      const colorCode = data?.meta?.color_code || null;

      setCookie(COOKIE_KEYS.MTK_ID, String(id));
      if (colorCode) setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);

      state.mtkId = id ?? null;
      state.mtk = data ?? null;
      state.storedColorCode = colorCode;

      // Cascading reset
      state.complexId = null;
      state.complex = null;
      state.buildingId = null;
      state.building = null;
      state.blockId = null;
      state.block = null;
      state.propertyId = null;
      state.property = null;
      state.filters.complexId = null;
      state.filters.buildingId = null;
      state.filters.blockId = null;
    },

    setComplex: (state, action) => {
      const { id, data } = action.payload || {};
      setCookie(COOKIE_KEYS.COMPLEX_ID, String(id));

      state.complexId = id ?? null;
      state.complex = data ?? null;

      // Cascading reset
      state.buildingId = null;
      state.building = null;
      state.blockId = null;
      state.block = null;
      state.propertyId = null;
      state.property = null;
      state.filters.buildingId = null;
      state.filters.blockId = null;
    },

    setBuilding: (state, action) => {
      const { id, data } = action.payload || {};
      setCookie(COOKIE_KEYS.BUILDING_ID, String(id));

      state.buildingId = id ?? null;
      state.building = data ?? null;

      // Cascading reset
      state.blockId = null;
      state.block = null;
      state.propertyId = null;
      state.property = null;
      state.filters.blockId = null;
    },

    setBlock: (state, action) => {
      const { id, data } = action.payload || {};
      setCookie(COOKIE_KEYS.BLOCK_ID, String(id));

      state.blockId = id ?? null;
      state.block = data ?? null;
      state.propertyId = null;
      state.property = null;
    },

    setProperty: (state, action) => {
      const { id, data } = action.payload || {};
      setCookie(COOKIE_KEYS.PROPERTY_ID, String(id));

      state.propertyId = id ?? null;
      state.property = data ?? null;
      state.residentId = null;
      state.resident = null;
    },

    setResident: (state, action) => {
      const { id, data } = action.payload || {};
      setCookie(COOKIE_KEYS.RESIDENT_ID, String(id));

      state.residentId = id ?? null;
      state.resident = data ?? null;
    },

    updateStoredColor: (state, action) => {
      const { colorCode } = action.payload || {};
      if (colorCode) setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);
      state.storedColorCode = colorCode;
    },

    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;

      // Cascading reset logic
      if (key === 'mtkId') {
        state.filters.complexId = null;
        state.filters.buildingId = null;
        state.filters.blockId = null;
      } else if (key === 'complexId') {
        state.filters.buildingId = null;
        state.filters.blockId = null;
      } else if (key === 'buildingId') {
        state.filters.blockId = null;
        state.filters.propertyId = null;
        state.filters.residentId = null;
      } else if (key === 'blockId') {
        state.filters.propertyId = null;
        state.filters.residentId = null;
      } else if (key === 'propertyId') {
        state.filters.residentId = null;
      }
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {
        mtkId: null,
        complexId: null,
        buildingId: null,
        blockId: null,
        propertyId: null,
        residentId: null,
        search: '',
        status: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // loadAllLists
      .addCase(loadAllLists.pending, (state) => {
        state.isInitializing = true;
        state.loading.mtks = true;
        state.loading.complexes = true;
        state.loading.buildings = true;
        state.loading.blocks = true;
        state.loading.properties = true;
        state.loading.residents = true;
      })
      .addCase(loadAllLists.fulfilled, (state, action) => {
        const normalized = normalizeAllLists(action.payload);
        const indexedMaps = buildIndexedMaps({ ...state.lists, ...normalized });

        state.lists = { ...state.lists, ...normalized };
        state.indexedMaps = indexedMaps;
        state.isInitializing = false;
        state.loading.mtks = false;
        state.loading.complexes = false;
        state.loading.buildings = false;
        state.loading.blocks = false;
        state.loading.properties = false;
        state.loading.residents = false;
      })
      .addCase(loadAllLists.rejected, (state) => {
        state.isInitializing = false;
        state.loading.mtks = false;
        state.loading.complexes = false;
        state.loading.buildings = false;
        state.loading.blocks = false;
        state.loading.properties = false;
        state.loading.residents = false;
      })

      // refreshList
      .addCase(refreshList.pending, (state, action) => {
        state.loading[action.meta.arg] = true;
      })
      .addCase(refreshList.fulfilled, (state, action) => {
        const { key, list } = action.payload;
        const normalized = normalizeList(list);
        const newLists = { ...state.lists, [key]: normalized };
        const indexedMaps = buildIndexedMaps(newLists);

        state.lists = newLists;
        state.indexedMaps = indexedMaps;
        state.loading[key] = false;
      })
      .addCase(refreshList.rejected, (state, action) => {
        state.loading[action.meta.arg] = false;
      })

      // loadEntityById
      .addCase(loadEntityById.fulfilled, (state, action) => {
        const { type, id, data } = action.payload;
        const entityMap = {
          mtk: { idKey: 'mtkId', dataKey: 'mtk' },
          complex: { idKey: 'complexId', dataKey: 'complex' },
          building: { idKey: 'buildingId', dataKey: 'building' },
          block: { idKey: 'blockId', dataKey: 'block' },
          property: { idKey: 'propertyId', dataKey: 'property' },
          resident: { idKey: 'residentId', dataKey: 'resident' },
        };

        const mapping = entityMap[type];
        if (mapping) {
          state[mapping.idKey] = id;
          state[mapping.dataKey] = data;

          // Update color code for MTK
          if (type === 'mtk' && data?.meta?.color_code) {
            state.storedColorCode = data.meta.color_code;
            setCookie(COOKIE_KEYS.MTK_COLOR_CODE, data.meta.color_code);
          }
        }
      });
  },
});

// Helper function
function normalizeList(list = []) {
  const entities = {};
  const ids = [];
  list.forEach((item) => {
    if (item?.id) {
      entities[item.id] = item;
      ids.push(item.id);
    }
  });
  return { entities, ids };
}

export const {
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
} = managementSlice.actions;

export default managementSlice.reducer;


