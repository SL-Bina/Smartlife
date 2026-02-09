import React from "react";
import PropTypes from "prop-types";

export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

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

export function reducer(state, action) {
  switch (action.type) {
    case "OPEN_SIDENAV": {
      return { ...state, openSidenav: action.value };
    }
    case "SIDENAV_TYPE": {
      return { ...state, sidenavType: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "DARK_MODE": {
      return { ...state, darkMode: action.value };
    }
    case "SIDENAV_COLLAPSED": {
      return { ...state, sidenavCollapsed: action.value };
    }
    case "SIDENAV_FLAT_MENU": {
      return { ...state, sidenavFlatMenu: action.value };
    }
    case "SIDENAV_EXPAND_ALL": {
      return { ...state, sidenavExpandAll: action.value };
    }
    case "SIDENAV_SIZE": {
      return { ...state, sidenavSize: action.value };
    }
    case "SIDENAV_POSITION": {
      return { ...state, sidenavPosition: action.value };
    }
    case "NAVBAR_COLOR": {
      return { ...state, navbarColor: action.value };
    }
    case "NAVBAR_HEIGHT": {
      return { ...state, navbarHeight: action.value };
    }
    case "NAVBAR_STYLE": {
      return { ...state, navbarStyle: action.value };
    }
    case "NAVBAR_SHADOW": {
      return { ...state, navbarShadow: action.value };
    }
    case "NAVBAR_BORDER": {
      return { ...state, navbarBorder: action.value };
    }
    case "NAVBAR_BLUR": {
      return { ...state, navbarBlur: action.value };
    }
    case "NAVBAR_TRANSPARENCY": {
      return { ...state, navbarTransparency: action.value };
    }
    case "NAVBAR_POSITION": {
      return { ...state, navbarPosition: action.value };
    }
    case "NAVBAR_ANIMATIONS": {
      return { ...state, navbarAnimations: action.value };
    }
    case "NAVBAR_HOVER_EFFECTS": {
      return { ...state, navbarHoverEffects: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function MaterialTailwindControllerProvider({ children }) {
  const getInitialDarkMode = () => {
    if (typeof window !== "undefined") {
      // Əvvəlcə cookie-dən oxu, yoxdursa localStorage-dən (migrasiya üçün)
      const cookieValue = getCookie("darkMode");
      if (cookieValue !== null) {
        return cookieValue === "true";
      }
      // localStorage-dən köhnə dəyəri oxu və cookie-yə köçür
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        setCookie("darkMode", saved);
        localStorage.removeItem("darkMode");
        return saved === "true";
      }
    }
    return false;
  };

  const getInitialSidenavCollapsed = () => {
    if (typeof window !== "undefined") {
      const cookieValue = getCookie("sidenavCollapsed");
      if (cookieValue !== null) {
        return cookieValue === "true";
      }
      const saved = localStorage.getItem("sidenavCollapsed");
      if (saved !== null) {
        setCookie("sidenavCollapsed", saved);
        localStorage.removeItem("sidenavCollapsed");
        return saved === "true";
      }
    }
    return false;
  };

  const getInitialSidenavFlatMenu = () => {
    if (typeof window !== "undefined") {
      const cookieValue = getCookie("sidenavFlatMenu");
      if (cookieValue !== null) {
        return cookieValue === "true";
      }
      const saved = localStorage.getItem("sidenavFlatMenu");
      if (saved !== null) {
        setCookie("sidenavFlatMenu", saved);
        localStorage.removeItem("sidenavFlatMenu");
        return saved === "true";
      }
    }
    return false;
  };

  const getInitialSidenavExpandAll = () => {
    if (typeof window !== "undefined") {
      const cookieValue = getCookie("sidenavExpandAll");
      if (cookieValue !== null) {
        return cookieValue === "true";
      }
      const saved = localStorage.getItem("sidenavExpandAll");
      if (saved !== null) {
        setCookie("sidenavExpandAll", saved);
        localStorage.removeItem("sidenavExpandAll");
        return saved === "true";
      }
    }
    return false;
  };

  const getInitialSidenavSize = () => {
    if (typeof window !== "undefined") {
      const cookieValue = getCookie("sidenavSize");
      if (cookieValue !== null) {
        return cookieValue;
      }
      const saved = localStorage.getItem("sidenavSize");
      if (saved !== null) {
        setCookie("sidenavSize", saved);
        localStorage.removeItem("sidenavSize");
        return saved;
      }
    }
    return "medium";
  };

  const getInitialSidenavPosition = () => {
    if (typeof window !== "undefined") {
      const cookieValue = getCookie("sidenavPosition");
      if (cookieValue !== null) {
        return cookieValue;
      }
      const saved = localStorage.getItem("sidenavPosition");
      if (saved !== null) {
        setCookie("sidenavPosition", saved);
        localStorage.removeItem("sidenavPosition");
        return saved;
      }
    }
    return "left";
  };

  const getInitialNavbarValue = (key, defaultValue) => {
    if (typeof window !== "undefined") {
      const cookieValue = getCookie(key);
      if (cookieValue !== null) {
        return cookieValue;
      }
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        setCookie(key, saved);
        localStorage.removeItem(key);
        return saved;
      }
    }
    return defaultValue;
  };

  const initialState = {
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
    darkMode: getInitialDarkMode(),
    sidenavCollapsed: getInitialSidenavCollapsed(),
    sidenavFlatMenu: getInitialSidenavFlatMenu(),
    sidenavExpandAll: getInitialSidenavExpandAll(),
    sidenavSize: getInitialSidenavSize(),
    sidenavPosition: getInitialSidenavPosition(),
    navbarColor: getInitialNavbarValue("navbarColor", "default"),
    navbarHeight: getInitialNavbarValue("navbarHeight", "normal"),
    navbarStyle: getInitialNavbarValue("navbarStyle", "modern"),
    navbarShadow: getInitialNavbarValue("navbarShadow", "medium"),
    navbarBorder: getInitialNavbarValue("navbarBorder", "enabled"),
    navbarBlur: getInitialNavbarValue("navbarBlur", "enabled"),
    navbarTransparency: getInitialNavbarValue("navbarTransparency", "95"),
    navbarPosition: getInitialNavbarValue("navbarPosition", "top"),
    navbarAnimations: getInitialNavbarValue("navbarAnimations", "enabled"),
    navbarHoverEffects: getInitialNavbarValue("navbarHoverEffects", "enabled"),
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (controller.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setCookie("darkMode", String(controller.darkMode));
  }, [controller.darkMode]);

  React.useEffect(() => {
    setCookie("sidenavCollapsed", String(controller.sidenavCollapsed));
  }, [controller.sidenavCollapsed]);

  React.useEffect(() => {
    setCookie("sidenavFlatMenu", String(controller.sidenavFlatMenu));
  }, [controller.sidenavFlatMenu]);

  React.useEffect(() => {
    setCookie("sidenavExpandAll", String(controller.sidenavExpandAll));
  }, [controller.sidenavExpandAll]);

  React.useEffect(() => {
    setCookie("sidenavSize", controller.sidenavSize);
  }, [controller.sidenavSize]);

  React.useEffect(() => {
    setCookie("sidenavPosition", controller.sidenavPosition);
  }, [controller.sidenavPosition]);

  React.useEffect(() => {
    setCookie("navbarColor", controller.navbarColor);
  }, [controller.navbarColor]);

  React.useEffect(() => {
    setCookie("navbarHeight", controller.navbarHeight);
  }, [controller.navbarHeight]);

  React.useEffect(() => {
    setCookie("navbarStyle", controller.navbarStyle);
  }, [controller.navbarStyle]);

  React.useEffect(() => {
    setCookie("navbarShadow", controller.navbarShadow);
  }, [controller.navbarShadow]);

  React.useEffect(() => {
    setCookie("navbarBorder", controller.navbarBorder);
  }, [controller.navbarBorder]);

  React.useEffect(() => {
    setCookie("navbarBlur", controller.navbarBlur);
  }, [controller.navbarBlur]);

  React.useEffect(() => {
    setCookie("navbarTransparency", controller.navbarTransparency);
  }, [controller.navbarTransparency]);

  React.useEffect(() => {
    setCookie("navbarPosition", controller.navbarPosition);
  }, [controller.navbarPosition]);

  React.useEffect(() => {
    setCookie("navbarAnimations", controller.navbarAnimations);
  }, [controller.navbarAnimations]);

  React.useEffect(() => {
    setCookie("navbarHoverEffects", controller.navbarHoverEffects);
  }, [controller.navbarHoverEffects]);

  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

export function useMaterialTailwindController() {
  const context = React.useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.jsx";

MaterialTailwindControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const setOpenSidenav = (dispatch, value) =>
  dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch, value) =>
  dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
export const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
export const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
export const setDarkMode = (dispatch, value) =>
  dispatch({ type: "DARK_MODE", value });
export const setSidenavCollapsed = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLLAPSED", value });
export const setSidenavFlatMenu = (dispatch, value) =>
  dispatch({ type: "SIDENAV_FLAT_MENU", value });
export const setSidenavExpandAll = (dispatch, value) =>
  dispatch({ type: "SIDENAV_EXPAND_ALL", value });
export const setSidenavSize = (dispatch, value) =>
  dispatch({ type: "SIDENAV_SIZE", value });
export const setSidenavPosition = (dispatch, value) =>
  dispatch({ type: "SIDENAV_POSITION", value });
export const setNavbarColor = (dispatch, value) =>
  dispatch({ type: "NAVBAR_COLOR", value });
export const setNavbarHeight = (dispatch, value) =>
  dispatch({ type: "NAVBAR_HEIGHT", value });
export const setNavbarStyle = (dispatch, value) =>
  dispatch({ type: "NAVBAR_STYLE", value });
export const setNavbarShadow = (dispatch, value) =>
  dispatch({ type: "NAVBAR_SHADOW", value });
export const setNavbarBorder = (dispatch, value) =>
  dispatch({ type: "NAVBAR_BORDER", value });
export const setNavbarBlur = (dispatch, value) =>
  dispatch({ type: "NAVBAR_BLUR", value });
export const setNavbarTransparency = (dispatch, value) =>
  dispatch({ type: "NAVBAR_TRANSPARENCY", value });
export const setNavbarPosition = (dispatch, value) =>
  dispatch({ type: "NAVBAR_POSITION", value });
export const setNavbarAnimations = (dispatch, value) =>
  dispatch({ type: "NAVBAR_ANIMATIONS", value });
export const setNavbarHoverEffects = (dispatch, value) =>
  dispatch({ type: "NAVBAR_HOVER_EFFECTS", value });

export { ManagementProvider, useManagement, colorUtils } from "./ManagementContext";
export { ManagementProviderEnhanced, useManagementEnhanced, colorUtils as colorUtilsEnhanced, useMtkColor } from "./ManagementContextEnhanced";