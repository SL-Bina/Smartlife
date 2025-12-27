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

  const initialState = {
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
    darkMode: getInitialDarkMode(),
    sidenavCollapsed: getInitialSidenavCollapsed(),
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

// Export Management Context
export { ManagementProvider, useManagement } from "./ManagementContext";