import React, { createContext, useContext, useMemo, useReducer, useEffect } from "react";
import mtkAPI from "@/pages/dashboard/management/mtk/api";
import complexAPI from "@/pages/dashboard/management/complex/api";
import buildingAPI from "@/pages/dashboard/management/buildings/api";

const ManagementContext = createContext(null);

// Cookie keys
const COOKIE_KEYS = {
  MTK_ID: "smartlife_mtk_id",
  MTK_COLOR_CODE: "smartlife_mtk_color_code",
  COMPLEX_ID: "smartlife_complex_id",
  BUILDING_ID: "smartlife_building_id",
  BLOCK_ID: "smartlife_block_id",
  PROPERTY_ID: "smartlife_property_id",
};

// Cookie utility funksiyaları
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

// Cookie-dən ID-ləri oxu
const getStoredMtkId = () => {
  const id = getCookie(COOKIE_KEYS.MTK_ID);
  return id ? parseInt(id, 10) : null;
};

const getStoredComplexId = () => {
  const id = getCookie(COOKIE_KEYS.COMPLEX_ID);
  return id ? parseInt(id, 10) : null;
};

const getStoredBuildingId = () => {
  const id = getCookie(COOKIE_KEYS.BUILDING_ID);
  return id ? parseInt(id, 10) : null;
};

const getStoredBlockId = () => {
  const id = getCookie(COOKIE_KEYS.BLOCK_ID);
  return id ? parseInt(id, 10) : null;
};

const getStoredPropertyId = () => {
  const id = getCookie(COOKIE_KEYS.PROPERTY_ID);
  return id ? parseInt(id, 10) : null;
};

const getStoredColorCode = () => {
  return getCookie(COOKIE_KEYS.MTK_COLOR_CODE);
};

// Cookie-ə ID-ləri yaz
const setStoredMtkId = (id) => {
  if (id) {
    setCookie(COOKIE_KEYS.MTK_ID, String(id));
  } else {
    removeCookie(COOKIE_KEYS.MTK_ID);
  }
};

const setStoredComplexId = (id) => {
  if (id) {
    setCookie(COOKIE_KEYS.COMPLEX_ID, String(id));
  } else {
    removeCookie(COOKIE_KEYS.COMPLEX_ID);
  }
};

const setStoredBuildingId = (id) => {
  if (id) {
    setCookie(COOKIE_KEYS.BUILDING_ID, String(id));
  } else {
    removeCookie(COOKIE_KEYS.BUILDING_ID);
  }
};

const setStoredBlockId = (id) => {
  if (id) {
    setCookie(COOKIE_KEYS.BLOCK_ID, String(id));
  } else {
    removeCookie(COOKIE_KEYS.BLOCK_ID);
  }
};

const setStoredPropertyId = (id) => {
  if (id) {
    setCookie(COOKIE_KEYS.PROPERTY_ID, String(id));
  } else {
    removeCookie(COOKIE_KEYS.PROPERTY_ID);
  }
};

const setStoredColorCode = (colorCode) => {
  if (colorCode) {
    setCookie(COOKIE_KEYS.MTK_COLOR_CODE, colorCode);
  } else {
    removeCookie(COOKIE_KEYS.MTK_COLOR_CODE);
  }
};

const initialState = {
  mtkId: getStoredMtkId(),
  mtk: null,

  complexId: getStoredComplexId(),
  complex: null,

  buildingId: getStoredBuildingId(),
  building: null,

  blockId: getStoredBlockId(),
  block: null,

  propertyId: getStoredPropertyId(),
  property: null,
  
  // Cookie-dən gələn rəng kodu (MTK data yüklənməmiş olsa belə)
  storedColorCode: getStoredColorCode(),
  
  // Default ID-lərin yüklənməsi üçün flag
  isInitializing: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "RESET_ALL": {
      // Cookie-ləri təmizlə
      setStoredMtkId(null);
      setStoredComplexId(null);
      setStoredBuildingId(null);
      setStoredBlockId(null);
      setStoredPropertyId(null);
      setStoredColorCode(null);
      return { 
        ...initialState, 
        mtkId: null,
        complexId: null,
        buildingId: null,
        blockId: null,
        propertyId: null,
        storedColorCode: null,
        isInitializing: false,
      };
    }

    case "SET_MTK": {
      const { id, data } = action.payload || {};
      const colorCode = data?.meta?.color_code || null;
      
      // Cookie-ə yaz
      setStoredMtkId(id);
      setStoredColorCode(colorCode);
      
      return {
        ...state,
        mtkId: id ?? null,
        mtk: data ?? null,
        storedColorCode: colorCode,
        complexId: null,
        complex: null,
        buildingId: null,
        building: null,
        blockId: null,
        block: null,
        propertyId: null,
        property: null,
      };
    }

    case "SET_COMPLEX": {
      const { id, data } = action.payload || {};
      // Cookie-ə yaz
      setStoredComplexId(id);
      
      return {
        ...state,
        complexId: id ?? null,
        complex: data ?? null,
        buildingId: null,
        building: null,
        blockId: null,
        block: null,
        propertyId: null,
        property: null,
      };
    }

    case "SET_BUILDING": {
      const { id, data } = action.payload || {};
      // Cookie-ə yaz
      setStoredBuildingId(id);
      
      return {
        ...state,
        buildingId: id ?? null,
        building: data ?? null,
        blockId: null,
        block: null,
        propertyId: null,
        property: null,
      };
    }

    case "SET_BLOCK": {
      const { id, data } = action.payload || {};
      // Cookie-ə yaz
      setStoredBlockId(id);
      
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
      // Cookie-ə yaz
      setStoredPropertyId(id);
      
      return {
        ...state,
        propertyId: id ?? null,
        property: data ?? null,
      };
    }

    case "UPDATE_STORED_COLOR": {
      const { colorCode } = action.payload || {};
      setStoredColorCode(colorCode);
      return {
        ...state,
        storedColorCode: colorCode,
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

export function ManagementProvider({ children }) {
  // Cookie-dən ilkin state-i yüklə
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    storedColorCode: getStoredColorCode(),
  });

  // Default ID-ləri yüklə (birinci ID-ləri seç) - yalnız bir dəfə
  useEffect(() => {
    if (!state.isInitializing) return;

    const initializeDefaultIds = async () => {
      try {
        // MTK ID yoxdursa, birinci MTK-nı seç
        if (!state.mtkId) {
          try {
            const mtkRes = await mtkAPI.getAll({ page: 1, per_page: 1 });
            const mtkList = mtkRes?.data?.data || [];
            if (mtkList.length > 0) {
              const firstMtk = mtkList[0];
              const mtkDetailRes = await mtkAPI.getById(firstMtk.id);
              const mtkData = mtkDetailRes?.data || null;
              dispatch({ 
                type: "SET_MTK", 
                payload: { id: firstMtk.id, data: mtkData } 
              });
            }
          } catch (e) {
            console.error("Error loading default MTK:", e);
          }
        } else if (state.mtkId && !state.mtk) {
          // MTK ID var amma data yoxdursa, data yüklə
          try {
            const mtkDetailRes = await mtkAPI.getById(state.mtkId);
            const mtkData = mtkDetailRes?.data || null;
            dispatch({ 
              type: "SET_MTK", 
              payload: { id: state.mtkId, data: mtkData } 
            });
          } catch (e) {
            console.error("Error loading MTK data:", e);
          }
        }

        // Complex ID yoxdursa və MTK ID varsa, birinci Complex-i seç
        const currentMtkId = state.mtkId || getStoredMtkId();
        if (currentMtkId && !state.complexId) {
          try {
            const complexRes = await complexAPI.getAll({ 
              page: 1, 
              per_page: 1,
              mtk_id: currentMtkId 
            });
            const complexList = complexRes?.data?.data || [];
            if (complexList.length > 0) {
              const firstComplex = complexList[0];
              const complexDetailRes = await complexAPI.getById(firstComplex.id);
              const complexData = complexDetailRes?.data || null;
              dispatch({ 
                type: "SET_COMPLEX", 
                payload: { id: firstComplex.id, data: complexData } 
              });
            }
          } catch (e) {
            console.error("Error loading default Complex:", e);
          }
        } else if (state.complexId && !state.complex) {
          // Complex ID var amma data yoxdursa, data yüklə
          try {
            const complexDetailRes = await complexAPI.getById(state.complexId);
            const complexData = complexDetailRes?.data || null;
            dispatch({ 
              type: "SET_COMPLEX", 
              payload: { id: state.complexId, data: complexData } 
            });
          } catch (e) {
            console.error("Error loading Complex data:", e);
          }
        }

        // Building ID yoxdursa və Complex ID varsa, birinci Building-i seç
        const currentComplexId = state.complexId || getStoredComplexId();
        if (currentComplexId && !state.buildingId) {
          try {
            const buildingRes = await buildingAPI.getAll({ 
              page: 1, 
              per_page: 1,
              complex_id: currentComplexId 
            });
            const buildingList = buildingRes?.data?.data || [];
            if (buildingList.length > 0) {
              const firstBuilding = buildingList[0];
              const buildingDetailRes = await buildingAPI.getById(firstBuilding.id);
              const buildingData = buildingDetailRes?.data || null;
              dispatch({ 
                type: "SET_BUILDING", 
                payload: { id: firstBuilding.id, data: buildingData } 
              });
            }
          } catch (e) {
            console.error("Error loading default Building:", e);
          }
        } else if (state.buildingId && !state.building) {
          // Building ID var amma data yoxdursa, data yüklə
          try {
            const buildingDetailRes = await buildingAPI.getById(state.buildingId);
            const buildingData = buildingDetailRes?.data || null;
            dispatch({ 
              type: "SET_BUILDING", 
              payload: { id: state.buildingId, data: buildingData } 
            });
          } catch (e) {
            console.error("Error loading Building data:", e);
          }
        }

        dispatch({ type: "SET_INITIALIZING", payload: false });
      } catch (e) {
        console.error("Error initializing default IDs:", e);
        dispatch({ type: "SET_INITIALIZING", payload: false });
      }
    };

    initializeDefaultIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isInitializing]);

  // ID dəyişəndə data yoxdursa, data yüklə
  useEffect(() => {
    if (state.isInitializing) return;

    // MTK ID var amma data yoxdursa, data yüklə
    if (state.mtkId && !state.mtk) {
      mtkAPI.getById(state.mtkId)
        .then((res) => {
          const mtkData = res?.data || null;
          dispatch({ 
            type: "SET_MTK", 
            payload: { id: state.mtkId, data: mtkData } 
          });
        })
        .catch((e) => {
          console.error("Error loading MTK data:", e);
        });
    }

    // Complex ID var amma data yoxdursa, data yüklə
    if (state.complexId && !state.complex) {
      complexAPI.getById(state.complexId)
        .then((res) => {
          const complexData = res?.data || null;
          dispatch({ 
            type: "SET_COMPLEX", 
            payload: { id: state.complexId, data: complexData } 
          });
        })
        .catch((e) => {
          console.error("Error loading Complex data:", e);
        });
    }

    // Building ID var amma data yoxdursa, data yüklə
    if (state.buildingId && !state.building) {
      buildingAPI.getById(state.buildingId)
        .then((res) => {
          const buildingData = res?.data || null;
          dispatch({ 
            type: "SET_BUILDING", 
            payload: { id: state.buildingId, data: buildingData } 
          });
        })
        .catch((e) => {
          console.error("Error loading Building data:", e);
        });
    }
  }, [state.isInitializing, state.mtkId, state.complexId, state.buildingId, state.mtk, state.complex, state.building]);

  // MTK data-sı yüklənəndə rəng kodunu yenilə
  useEffect(() => {
    if (state.mtk?.meta?.color_code && state.mtk.meta.color_code !== state.storedColorCode) {
      setStoredColorCode(state.mtk.meta.color_code);
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
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <ManagementContext.Provider value={value}>{children}</ManagementContext.Provider>;
}

export function useManagement() {
  const ctx = useContext(ManagementContext);
  if (!ctx) throw new Error("useManagement must be used within <ManagementProvider />");
  return ctx;
}

// Rəng utility funksiyaları
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
  const { state } = useManagement();
  
  // Əvvəlcə state-dən (MTK data-sından), sonra localStorage-dən rəng kodunu götür
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