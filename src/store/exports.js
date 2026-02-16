export { colorUtils as colorUtilsEnhanced } from "./hooks/colorUtils";
export { useMtkColor } from "./hooks/useMtkColor";

export { useAuth } from "./hooks/useAuth";
export { useMaterialTailwindController } from "./hooks/useMaterialTailwind";

import {
  setOpenSidenav as setOpenSidenavAction,
  setSidenavType as setSidenavTypeAction,
  setSidenavColor as setSidenavColorAction,
  setTransparentNavbar as setTransparentNavbarAction,
  setFixedNavbar as setFixedNavbarAction,
  setOpenConfigurator as setOpenConfiguratorAction,
  setDarkMode as setDarkModeAction,
  setSidenavCollapsed as setSidenavCollapsedAction,
  setSidenavFlatMenu as setSidenavFlatMenuAction,
  setSidenavExpandAll as setSidenavExpandAllAction,
  setSidenavSize as setSidenavSizeAction,
  setSidenavPosition as setSidenavPositionAction,
  setNavbarColor as setNavbarColorAction,
  setNavbarHeight as setNavbarHeightAction,
  setNavbarStyle as setNavbarStyleAction,
  setNavbarShadow as setNavbarShadowAction,
  setNavbarBorder as setNavbarBorderAction,
  setNavbarBlur as setNavbarBlurAction,
  setNavbarTransparency as setNavbarTransparencyAction,
  setNavbarPosition as setNavbarPositionAction,
  setNavbarAnimations as setNavbarAnimationsAction,
  setNavbarHoverEffects as setNavbarHoverEffectsAction,
} from "./slices/uiSlice";
import { useAppDispatch } from "./hooks";

// Helper functions that work with actions object or dispatch function
export const setOpenSidenav = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setOpenSidenav === 'function') {
    actionsOrDispatch.setOpenSidenav(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setOpenSidenavAction(value));
  }
};

export const setSidenavType = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setSidenavType === 'function') {
    actionsOrDispatch.setSidenavType(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setSidenavTypeAction(value));
  }
};

export const setSidenavColor = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setSidenavColor === 'function') {
    actionsOrDispatch.setSidenavColor(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setSidenavColorAction(value));
  }
};

export const setTransparentNavbar = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setTransparentNavbar === 'function') {
    actionsOrDispatch.setTransparentNavbar(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setTransparentNavbarAction(value));
  }
};

export const setFixedNavbar = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setFixedNavbar === 'function') {
    actionsOrDispatch.setFixedNavbar(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setFixedNavbarAction(value));
  }
};

export const setOpenConfigurator = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setOpenConfigurator === 'function') {
    actionsOrDispatch.setOpenConfigurator(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setOpenConfiguratorAction(value));
  }
};

export const setDarkMode = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setDarkMode === 'function') {
    actionsOrDispatch.setDarkMode(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setDarkModeAction(value));
  }
};

export const setSidenavCollapsed = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setSidenavCollapsed === 'function') {
    actionsOrDispatch.setSidenavCollapsed(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setSidenavCollapsedAction(value));
  }
};

export const setSidenavFlatMenu = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setSidenavFlatMenu === 'function') {
    actionsOrDispatch.setSidenavFlatMenu(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setSidenavFlatMenuAction(value));
  }
};

export const setSidenavExpandAll = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setSidenavExpandAll === 'function') {
    actionsOrDispatch.setSidenavExpandAll(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setSidenavExpandAllAction(value));
  }
};

export const setSidenavSize = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setSidenavSize === 'function') {
    actionsOrDispatch.setSidenavSize(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setSidenavSizeAction(value));
  }
};

export const setSidenavPosition = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setSidenavPosition === 'function') {
    actionsOrDispatch.setSidenavPosition(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setSidenavPositionAction(value));
  }
};

export const setNavbarColor = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setNavbarColor === 'function') {
    actionsOrDispatch.setNavbarColor(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setNavbarColorAction(value));
  }
};

export const setNavbarHeight = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setNavbarHeight === 'function') {
    actionsOrDispatch.setNavbarHeight(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setNavbarHeightAction(value));
  }
};

export const setNavbarStyle = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setNavbarStyle === 'function') {
    actionsOrDispatch.setNavbarStyle(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setNavbarStyleAction(value));
  }
};

export const setNavbarShadow = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setNavbarShadow === 'function') {
    actionsOrDispatch.setNavbarShadow(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setNavbarShadowAction(value));
  }
};

export const setNavbarBorder = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setNavbarBorder === 'function') {
    actionsOrDispatch.setNavbarBorder(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setNavbarBorderAction(value));
  }
};

export const setNavbarBlur = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setNavbarBlur === 'function') {
    actionsOrDispatch.setNavbarBlur(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setNavbarBlurAction(value));
  }
};

export const setNavbarTransparency = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setNavbarTransparency === 'function') {
    actionsOrDispatch.setNavbarTransparency(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setNavbarTransparencyAction(value));
  }
};

export const setNavbarPosition = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setNavbarPosition === 'function') {
    actionsOrDispatch.setNavbarPosition(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setNavbarPositionAction(value));
  }
};

export const setNavbarAnimations = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setNavbarAnimations === 'function') {
    actionsOrDispatch.setNavbarAnimations(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setNavbarAnimationsAction(value));
  }
};

export const setNavbarHoverEffects = (actionsOrDispatch, value) => {
  if (actionsOrDispatch && typeof actionsOrDispatch.setNavbarHoverEffects === 'function') {
    actionsOrDispatch.setNavbarHoverEffects(value);
  } else if (typeof actionsOrDispatch === 'function') {
    actionsOrDispatch(setNavbarHoverEffectsAction(value));
  }
};

// Legacy providers (no-op, Redux handles state)
export const ManagementProviderEnhanced = ({ children }) => children;
export const MaterialTailwindControllerProvider = ({ children }) => children;
export const AuthProvider = ({ children }) => children;


