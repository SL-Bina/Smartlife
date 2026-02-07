import React from "react";
import PropTypes from "prop-types";

export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

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
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function MaterialTailwindControllerProvider({ children }) {
  const getInitialDarkMode = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved === "true";
    }
    return false;
  };

  const getInitialSidenavCollapsed = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidenavCollapsed");
      return saved === "true";
    }
    return false;
  };

  const getInitialSidenavFlatMenu = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidenavFlatMenu");
      return saved === "true";
    }
    return false;
  };

  const getInitialSidenavExpandAll = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidenavExpandAll");
      return saved === "true";
    }
    return false;
  };

  const getInitialSidenavSize = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidenavSize");
      return saved || "medium";
    }
    return "medium";
  };

  const getInitialSidenavPosition = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidenavPosition");
      return saved || "left";
    }
    return "left";
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
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (controller.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(controller.darkMode));
  }, [controller.darkMode]);

  React.useEffect(() => {
    localStorage.setItem("sidenavCollapsed", String(controller.sidenavCollapsed));
  }, [controller.sidenavCollapsed]);

  React.useEffect(() => {
    localStorage.setItem("sidenavFlatMenu", String(controller.sidenavFlatMenu));
  }, [controller.sidenavFlatMenu]);

  React.useEffect(() => {
    localStorage.setItem("sidenavExpandAll", String(controller.sidenavExpandAll));
  }, [controller.sidenavExpandAll]);

  React.useEffect(() => {
    localStorage.setItem("sidenavSize", controller.sidenavSize);
  }, [controller.sidenavSize]);

  React.useEffect(() => {
    localStorage.setItem("sidenavPosition", controller.sidenavPosition);
  }, [controller.sidenavPosition]);

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

export { ManagementProvider, useManagement } from "./ManagementContext";