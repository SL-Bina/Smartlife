/**
 * Enhanced ManagementContext
 * 
 * Bu fayl mövcud ManagementContext-i genişləndirir və aşağıdakı funksionallıqları əlavə edir:
 * - Filters (mtkId, complexId, buildingId, blockId, search, status)
 * - Lists (mtks, complexes, buildings, blocks, properties) - normalized entities
 * - Cascading filter reset
 * - URL query sync
 */

import React, { createContext, useContext, useMemo, useReducer, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { normalizeAllLists, buildIndexedMaps } from "@/utils/management/normalization";
import mtkAPI from "@/pages/dashboard/management/mtk/api";
import complexAPI from "@/pages/dashboard/management/complex/api";
import buildingAPI from "@/pages/dashboard/management/buildings/api";
import blockAPI from "@/pages/dashboard/management/blocks/api";
import propertiesAPI from "@/pages/dashboard/management/properties/api";
import { fetchResidents, fetchResidentById } from "@/pages/dashboard/management/residents/api";

const ManagementContextEnhanced = createContext(null);

// Cookie keys (mövcud ManagementContext-dən)
const COOKIE_KEYS = {
  MTK_ID: "smartlife_mtk_id",
  MTK_COLOR_CODE: "smartlife_mtk_color_code",
  COMPLEX_ID: "smartlife_complex_id",
  BUILDING_ID: "smartlife_building_id",
  BLOCK_ID: "smartlife_block_id",
  PROPERTY_ID: "smartlife_property_id",
  RESIDENT_ID: "smartlife_resident_id",
};

// Cookie utilities (mövcud ManagementContext-dən)
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

// Enhanced initial state
const getInitialState = () => {
  const getStoredId = (key) => {
    const id = getCookie(key);
    return id ? parseInt(id, 10) : null;
  };

  return {
    // Selected entities (mövcud)
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

    // NEW: Filters
    filters: {
      mtkId: null,
      complexId: null,
      buildingId: null,
      blockId: null,
      propertyId: null,
      residentId: null,
      search: "",
      status: null, // 'active' | 'inactive' | null
    },

    // NEW: Lists (normalized entities)
    lists: {
      mtks: { entities: {}, ids: [] },
      complexes: { entities: {}, ids: [] },
      buildings: { entities: {}, ids: [] },
      blocks: { entities: {}, ids: [] },
      properties: { entities: {}, ids: [] },
      residents: { entities: {}, ids: [] },
    },

    // NEW: Indexed maps for fast filtering
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
};

// Enhanced reducer
function reducer(state, action) {
  switch (action.type) {
    case "RESET_ALL": {
      Object.values(COOKIE_KEYS).forEach((key) => removeCookie(key));
      return {
        ...getInitialState(),
        isInitializing: false,
      };
    }

    case "SET_MTK": {
      const { id, data } = action.payload || {};
      const colorCode = data?.meta?.color_code || null;
      
      setCookie(COOKIE_KEYS.MTK_ID, String(id));
      if (colorCode) setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);
      
      return {
        ...state,
        mtkId: id ?? null,
        mtk: data ?? null,
        storedColorCode: colorCode,
        // Cascading reset
        complexId: null,
        complex: null,
        buildingId: null,
        building: null,
        blockId: null,
        block: null,
        propertyId: null,
        property: null,
        filters: {
          ...state.filters,
          complexId: null,
          buildingId: null,
          blockId: null,
        },
      };
    }

    case "SET_COMPLEX": {
      const { id, data } = action.payload || {};
      setCookie(COOKIE_KEYS.COMPLEX_ID, String(id));
      
      return {
        ...state,
        complexId: id ?? null,
        complex: data ?? null,
        // Cascading reset
        buildingId: null,
        building: null,
        blockId: null,
        block: null,
        propertyId: null,
        property: null,
        filters: {
          ...state.filters,
          buildingId: null,
          blockId: null,
        },
      };
    }

    case "SET_BUILDING": {
      const { id, data } = action.payload || {};
      setCookie(COOKIE_KEYS.BUILDING_ID, String(id));
      
      return {
        ...state,
        buildingId: id ?? null,
        building: data ?? null,
        // Cascading reset
        blockId: null,
        block: null,
        propertyId: null,
        property: null,
        filters: {
          ...state.filters,
          blockId: null,
        },
      };
    }

    case "SET_BLOCK": {
      const { id, data } = action.payload || {};
      setCookie(COOKIE_KEYS.BLOCK_ID, String(id));
      
      return {
        ...state,
        blockId: id ?? null,
        block: data ?? null,
        propertyId: null,
        property: null,
      };
    }

    case "SET_PROPERTY": {
      const { id, data } = action.payload || {};
      setCookie(COOKIE_KEYS.PROPERTY_ID, String(id));
      
      return {
        ...state,
        propertyId: id ?? null,
        property: data ?? null,
        residentId: null,
        resident: null,
      };
    }

    case "SET_RESIDENT": {
      const { id, data } = action.payload || {};
      setCookie(COOKIE_KEYS.RESIDENT_ID, String(id));
      
      return {
        ...state,
        residentId: id ?? null,
        resident: data ?? null,
      };
    }

    case "UPDATE_STORED_COLOR": {
      const { colorCode } = action.payload || {};
      if (colorCode) setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);
      return {
        ...state,
        storedColorCode: colorCode,
      };
    }

    // NEW: Filter actions
    case "SET_FILTER": {
      const { key, value } = action.payload;
      const newFilters = { ...state.filters, [key]: value };

      // Cascading reset logic
      if (key === "mtkId") {
        newFilters.complexId = null;
        newFilters.buildingId = null;
        newFilters.blockId = null;
      } else if (key === "complexId") {
        newFilters.buildingId = null;
        newFilters.blockId = null;
      } else if (key === "buildingId") {
        newFilters.blockId = null;
        newFilters.propertyId = null;
        newFilters.residentId = null;
      } else if (key === "blockId") {
        newFilters.propertyId = null;
        newFilters.residentId = null;
      } else if (key === "propertyId") {
        newFilters.residentId = null;
      }

      return {
        ...state,
        filters: newFilters,
      };
    }

    case "SET_FILTERS": {
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    }

    case "CLEAR_FILTERS": {
      return {
        ...state,
        filters: {
          mtkId: null,
          complexId: null,
          buildingId: null,
          blockId: null,
          propertyId: null,
          residentId: null,
          search: "",
          status: null,
        },
      };
    }

    // NEW: List actions
    case "SET_LISTS": {
      const normalized = normalizeAllLists(action.payload);
      const indexedMaps = buildIndexedMaps({ ...state.lists, ...normalized });
      
      return {
        ...state,
        lists: { ...state.lists, ...normalized },
        indexedMaps,
      };
    }

    case "SET_LIST": {
      const { key, list } = action.payload;
      const normalized = normalizeList(list);
      const newLists = { ...state.lists, [key]: normalized };
      const indexedMaps = buildIndexedMaps(newLists);
      
      return {
        ...state,
        lists: newLists,
        indexedMaps,
      };
    }

    case "SET_LOADING": {
      const { key, loading } = action.payload;
      return {
        ...state,
        loading: { ...state.loading, [key]: loading },
      };
    }

    case "SET_INITIALIZING": {
      return {
        ...state,
        isInitializing: action.payload ?? false,
      };
    }

    default:
      return state;
  }
}

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

export function ManagementProviderEnhanced({ children }) {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync URL query params with filters
  useEffect(() => {
    const urlFilters = {
      mtkId: searchParams.get("mtkId") ? parseInt(searchParams.get("mtkId"), 10) : null,
      complexId: searchParams.get("complexId") ? parseInt(searchParams.get("complexId"), 10) : null,
      buildingId: searchParams.get("buildingId") ? parseInt(searchParams.get("buildingId"), 10) : null,
      blockId: searchParams.get("blockId") ? parseInt(searchParams.get("blockId"), 10) : null,
      propertyId: searchParams.get("propertyId") ? parseInt(searchParams.get("propertyId"), 10) : null,
      residentId: searchParams.get("residentId") ? parseInt(searchParams.get("residentId"), 10) : null,
      search: searchParams.get("search") || "",
    };

    // Only update if different
    const hasChanges = Object.keys(urlFilters).some(
      (key) => urlFilters[key] !== state.filters[key]
    );

    if (hasChanges) {
      dispatch({ type: "SET_FILTERS", payload: urlFilters });
    }
  }, [searchParams]);

  // Sync filters to URL (optional - can be disabled)
  const syncFiltersToURL = (filters) => {
    const params = new URLSearchParams();
    if (filters.mtkId) params.set("mtkId", filters.mtkId);
    if (filters.complexId) params.set("complexId", filters.complexId);
    if (filters.buildingId) params.set("buildingId", filters.buildingId);
    if (filters.blockId) params.set("blockId", filters.blockId);
    if (filters.propertyId) params.set("propertyId", filters.propertyId);
    if (filters.residentId) params.set("residentId", filters.residentId);
    if (filters.search) params.set("search", filters.search);
    setSearchParams(params, { replace: true });
  };

  // Load all lists on mount
  useEffect(() => {
    const loadAllLists = async () => {
      try {
        // Load MTKs
        dispatch({ type: "SET_LOADING", payload: { key: "mtks", loading: true } });
        const mtkRes = await mtkAPI.getAll({ page: 1, per_page: 1000 });
        const mtkList = mtkRes?.data?.data || [];
        dispatch({ type: "SET_LIST", payload: { key: "mtks", list: mtkList } });
        dispatch({ type: "SET_LOADING", payload: { key: "mtks", loading: false } });

        // Load Complexes
        dispatch({ type: "SET_LOADING", payload: { key: "complexes", loading: true } });
        const complexRes = await complexAPI.getAll({ page: 1, per_page: 1000 });
        const complexList = complexRes?.data?.data || [];
        dispatch({ type: "SET_LIST", payload: { key: "complexes", list: complexList } });
        dispatch({ type: "SET_LOADING", payload: { key: "complexes", loading: false } });

        // Load Buildings
        dispatch({ type: "SET_LOADING", payload: { key: "buildings", loading: true } });
        const buildingRes = await buildingAPI.getAll({ page: 1, per_page: 1000 });
        const buildingList = buildingRes?.data?.data || [];
        dispatch({ type: "SET_LIST", payload: { key: "buildings", list: buildingList } });
        dispatch({ type: "SET_LOADING", payload: { key: "buildings", loading: false } });

        // Load Blocks
        dispatch({ type: "SET_LOADING", payload: { key: "blocks", loading: true } });
        const blockRes = await blockAPI.getAll({ page: 1, per_page: 1000 });
        const blockList = blockRes?.data?.data || [];
        dispatch({ type: "SET_LIST", payload: { key: "blocks", list: blockList } });
        dispatch({ type: "SET_LOADING", payload: { key: "blocks", loading: false } });

        // Load Properties
        dispatch({ type: "SET_LOADING", payload: { key: "properties", loading: true } });
        const propertyRes = await propertiesAPI.getAll({ page: 1, per_page: 1000 });
        const propertyList = propertyRes?.data?.data || [];
        dispatch({ type: "SET_LIST", payload: { key: "properties", list: propertyList } });
        dispatch({ type: "SET_LOADING", payload: { key: "properties", loading: false } });

        // Load Residents
        dispatch({ type: "SET_LOADING", payload: { key: "residents", loading: true } });
        try {
          const residentsRes = await fetchResidents({}, 1, 1000);
          const residentsList = residentsRes?.data || [];
          dispatch({ type: "SET_LIST", payload: { key: "residents", list: residentsList } });
        } catch (error) {
          console.error("Error loading residents:", error);
        }
        dispatch({ type: "SET_LOADING", payload: { key: "residents", loading: false } });

        dispatch({ type: "SET_INITIALIZING", payload: false });
      } catch (error) {
        console.error("Error loading lists:", error);
        dispatch({ type: "SET_INITIALIZING", payload: false });
      }
    };

    loadAllLists();
  }, []);

  // Load selected entity data when IDs exist but data is missing
  useEffect(() => {
    if (state.isInitializing) return;

    // Load MTK data
    if (state.mtkId && !state.mtk) {
      mtkAPI.getById(state.mtkId)
        .then((res) => {
          const mtkData = res?.data || null;
          dispatch({ type: "SET_MTK", payload: { id: state.mtkId, data: mtkData } });
        })
        .catch((e) => {
          console.error("Error loading MTK data:", e);
        });
    }

    // Load Complex data
    if (state.complexId && !state.complex) {
      complexAPI.getById(state.complexId)
        .then((res) => {
          const complexData = res?.data || null;
          dispatch({ type: "SET_COMPLEX", payload: { id: state.complexId, data: complexData } });
        })
        .catch((e) => {
          console.error("Error loading Complex data:", e);
        });
    }

    // Load Building data
    if (state.buildingId && !state.building) {
      buildingAPI.getById(state.buildingId)
        .then((res) => {
          const buildingData = res?.data || null;
          dispatch({ type: "SET_BUILDING", payload: { id: state.buildingId, data: buildingData } });
        })
        .catch((e) => {
          console.error("Error loading Building data:", e);
        });
    }

    // Load Block data
    if (state.blockId && !state.block) {
      blockAPI.getById(state.blockId)
        .then((res) => {
          const blockData = res?.data || null;
          dispatch({ type: "SET_BLOCK", payload: { id: state.blockId, data: blockData } });
        })
        .catch((e) => {
          console.error("Error loading Block data:", e);
        });
    }

    // Load Property data
    if (state.propertyId && !state.property) {
      propertiesAPI.getById(state.propertyId)
        .then((res) => {
          const propertyData = res?.data || null;
          dispatch({ type: "SET_PROPERTY", payload: { id: state.propertyId, data: propertyData } });
        })
        .catch((e) => {
          console.error("Error loading Property data:", e);
        });
    }

    // Load Resident data
    if (state.residentId && !state.resident) {
      fetchResidentById(state.residentId)
        .then((res) => {
          const residentData = res || null;
          dispatch({ type: "SET_RESIDENT", payload: { id: state.residentId, data: residentData } });
        })
        .catch((e) => {
          console.error("Error loading Resident data:", e);
        });
    }
  }, [state.isInitializing, state.mtkId, state.complexId, state.buildingId, state.blockId, state.propertyId, state.residentId, state.mtk, state.complex, state.building, state.block, state.property, state.resident]);

  // Update stored color when MTK data loads
  useEffect(() => {
    if (state.mtk?.meta?.color_code && state.mtk.meta.color_code !== state.storedColorCode) {
      dispatch({ 
        type: "UPDATE_STORED_COLOR", 
        payload: { colorCode: state.mtk.meta.color_code } 
      });
    }
  }, [state.mtk?.meta?.color_code, state.storedColorCode]);

  const actions = useMemo(
    () => ({
      resetAll: () => dispatch({ type: "RESET_ALL" }),

      setMtk: (id, data = null) => dispatch({ type: "SET_MTK", payload: { id, data } }),
      setComplex: (id, data = null) => dispatch({ type: "SET_COMPLEX", payload: { id, data } }),
      setBuilding: (id, data = null) => dispatch({ type: "SET_BUILDING", payload: { id, data } }),
      setBlock: (id, data = null) => dispatch({ type: "SET_BLOCK", payload: { id, data } }),
      setProperty: (id, data = null) => dispatch({ type: "SET_PROPERTY", payload: { id, data } }),
      setResident: (id, data = null) => dispatch({ type: "SET_RESIDENT", payload: { id, data } }),

      // Filter actions
      setFilter: (key, value) => {
        const newFilters = { ...state.filters, [key]: value };
        dispatch({ type: "SET_FILTER", payload: { key, value } });
        // Sync to URL
        syncFiltersToURL(newFilters);
      },
      setFilters: (filters) => {
        const newFilters = { ...state.filters, ...filters };
        dispatch({ type: "SET_FILTERS", payload: filters });
        // Sync to URL
        syncFiltersToURL(newFilters);
      },
      clearFilters: () => {
        dispatch({ type: "CLEAR_FILTERS" });
        // Sync to URL
        syncFiltersToURL({
          mtkId: null,
          complexId: null,
          buildingId: null,
          blockId: null,
          propertyId: null,
          residentId: null,
          search: "",
          status: null,
        });
      },

      // List actions
      refreshList: async (key) => {
        const apiMap = {
          mtks: mtkAPI,
          complexes: complexAPI,
          buildings: buildingAPI,
          blocks: blockAPI,
          properties: propertiesAPI,
          residents: { getAll: async (params) => await fetchResidents(params || {}, 1, 1000) },
        };

        const api = apiMap[key];
        if (!api) return;

        dispatch({ type: "SET_LOADING", payload: { key, loading: true } });
        try {
          const res = await api.getAll({ page: 1, per_page: 1000 });
          const list = res?.data?.data || [];
          dispatch({ type: "SET_LIST", payload: { key, list } });
        } catch (error) {
          console.error(`Error refreshing ${key}:`, error);
        } finally {
          dispatch({ type: "SET_LOADING", payload: { key, loading: false } });
        }
      },
    }),
    [state.filters]
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <ManagementContextEnhanced.Provider value={value}>
      {children}
    </ManagementContextEnhanced.Provider>
  );
}

export function useManagementEnhanced() {
  const ctx = useContext(ManagementContextEnhanced);
  if (!ctx) {
    throw new Error("useManagementEnhanced must be used within <ManagementProviderEnhanced />");
  }
  return ctx;
}

// Rəng utility funksiyaları (mövcud ManagementContext-dən)
export const colorUtils = {
  // Hex rəngi RGB-yə çevir
  hexToRgb: (hex) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return { r, g, b };
  },

  // Hex rəngi rgba-ya çevir
  hexToRgba: (hex, opacity = 1) => {
    if (!hex) return null;
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return null;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  },

  // Rəng koduna görə kontrast mətn rəngi müəyyən et (ağ və ya qara)
  getContrastColor: (hexColor) => {
    if (!hexColor) return "#000000";
    const rgb = colorUtils.hexToRgb(hexColor);
    if (!rgb) return "#000000";
    
    // Luminance hesabla
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    
    // Əgər luminance yüksəkdirsə (açıq rəng), qara mətn istifadə et
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  },

  // Gradient background yarat
  getGradientBackground: (hexColor, direction = "to right", opacity1 = 0.1, opacity2 = 0.05) => {
    if (!hexColor) return {};
    const color1 = colorUtils.hexToRgba(hexColor, opacity1);
    const color2 = colorUtils.hexToRgba(hexColor, opacity2);
    if (!color1 || !color2) return {};
    return {
      background: `linear-gradient(${direction}, ${color1}, ${color2}, ${color1})`,
    };
  },

  // Aktiv menu item üçün gradient
  getActiveGradient: (hexColor, opacity1 = 0.9, opacity2 = 1) => {
    if (!hexColor) return {};
    const color1 = colorUtils.hexToRgba(hexColor, opacity1);
    const color2 = colorUtils.hexToRgba(hexColor, opacity2);
    if (!color1 || !color2) return {};
    return {
      background: `linear-gradient(to right, ${color1}, ${color2})`,
      boxShadow: `0 10px 15px -3px ${colorUtils.hexToRgba(hexColor, 0.3)}, 0 4px 6px -2px ${colorUtils.hexToRgba(hexColor, 0.2)}`,
    };
  },

  // Hover rəngi
  getHoverColor: (hexColor, opacity = 0.15) => {
    return colorUtils.hexToRgba(hexColor, opacity);
  },

  // Selected rəngi
  getSelectedColor: (hexColor, opacity = 0.25) => {
    return colorUtils.hexToRgba(hexColor, opacity);
  },
};

// MTK rəng kodunu istifadə etmək üçün custom hook
export function useMtkColor() {
  const { state } = useManagementEnhanced();
  
  // Əvvəlcə state-dən (MTK data-sından), sonra storedColorCode-dan rəng kodunu götür
  const colorCode = state?.mtk?.meta?.color_code || state?.storedColorCode;

  return {
    colorCode,
    getRgba: (opacity = 1) => colorUtils.hexToRgba(colorCode, opacity),
    getContrastColor: () => colorUtils.getContrastColor(colorCode),
    getGradientBackground: (direction, opacity1, opacity2) => 
      colorUtils.getGradientBackground(colorCode, direction, opacity1, opacity2),
    getActiveGradient: (opacity1, opacity2) => 
      colorUtils.getActiveGradient(colorCode, opacity1, opacity2),
    getHoverColor: (opacity) => colorUtils.getHoverColor(colorCode, opacity),
    getSelectedColor: (opacity) => colorUtils.getSelectedColor(colorCode, opacity),
    // Default rənglər (rəng kodu yoxdursa)
    defaultColor: "#3b82f6", // Blue
    defaultHover: "rgba(59, 130, 246, 0.15)",
    defaultSelected: "rgba(59, 130, 246, 0.25)",
  };
}

