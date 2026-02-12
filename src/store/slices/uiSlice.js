import { createSlice } from '@reduxjs/toolkit';

const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  } catch (e) {
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

const getInitialValue = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue;
  const cookieValue = getCookie(key);
  if (cookieValue !== null) return cookieValue;
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    setCookie(key, saved);
    localStorage.removeItem(key);
    return saved;
  }
  return defaultValue;
};

const getInitialBool = (key, defaultValue = false) => {
  const value = getInitialValue(key, String(defaultValue));
  return value === 'true';
};

const initialState = {
  openSidenav: false,
  sidenavColor: 'dark',
  sidenavType: 'white',
  transparentNavbar: true,
  fixedNavbar: false,
  openConfigurator: false,
  darkMode: getInitialBool('darkMode', false),
  sidenavCollapsed: getInitialBool('sidenavCollapsed', false),
  sidenavFlatMenu: getInitialBool('sidenavFlatMenu', false),
  sidenavExpandAll: getInitialBool('sidenavExpandAll', false),
  sidenavSize: getInitialValue('sidenavSize', 'medium'),
  sidenavPosition: getInitialValue('sidenavPosition', 'left'),
  navbarColor: getInitialValue('navbarColor', 'default'),
  navbarHeight: getInitialValue('navbarHeight', 'normal'),
  navbarStyle: getInitialValue('navbarStyle', 'modern'),
  navbarShadow: getInitialValue('navbarShadow', 'medium'),
  navbarBorder: getInitialValue('navbarBorder', 'enabled'),
  navbarBlur: getInitialValue('navbarBlur', 'enabled'),
  navbarTransparency: getInitialValue('navbarTransparency', '95'),
  navbarPosition: getInitialValue('navbarPosition', 'top'),
  navbarAnimations: getInitialValue('navbarAnimations', 'enabled'),
  navbarHoverEffects: getInitialValue('navbarHoverEffects', 'enabled'),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setOpenSidenav: (state, action) => {
      state.openSidenav = action.payload;
    },
    setSidenavType: (state, action) => {
      state.sidenavType = action.payload;
    },
    setSidenavColor: (state, action) => {
      state.sidenavColor = action.payload;
    },
    setTransparentNavbar: (state, action) => {
      state.transparentNavbar = action.payload;
    },
    setFixedNavbar: (state, action) => {
      state.fixedNavbar = action.payload;
    },
    setOpenConfigurator: (state, action) => {
      state.openConfigurator = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      setCookie('darkMode', String(action.payload));
      if (typeof window !== 'undefined') {
        if (action.payload) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setSidenavCollapsed: (state, action) => {
      state.sidenavCollapsed = action.payload;
      setCookie('sidenavCollapsed', String(action.payload));
    },
    setSidenavFlatMenu: (state, action) => {
      state.sidenavFlatMenu = action.payload;
      setCookie('sidenavFlatMenu', String(action.payload));
    },
    setSidenavExpandAll: (state, action) => {
      state.sidenavExpandAll = action.payload;
      setCookie('sidenavExpandAll', String(action.payload));
    },
    setSidenavSize: (state, action) => {
      state.sidenavSize = action.payload;
      setCookie('sidenavSize', action.payload);
    },
    setSidenavPosition: (state, action) => {
      state.sidenavPosition = action.payload;
      setCookie('sidenavPosition', action.payload);
    },
    setNavbarColor: (state, action) => {
      state.navbarColor = action.payload;
      setCookie('navbarColor', action.payload);
    },
    setNavbarHeight: (state, action) => {
      state.navbarHeight = action.payload;
      setCookie('navbarHeight', action.payload);
    },
    setNavbarStyle: (state, action) => {
      state.navbarStyle = action.payload;
      setCookie('navbarStyle', action.payload);
    },
    setNavbarShadow: (state, action) => {
      state.navbarShadow = action.payload;
      setCookie('navbarShadow', action.payload);
    },
    setNavbarBorder: (state, action) => {
      state.navbarBorder = action.payload;
      setCookie('navbarBorder', action.payload);
    },
    setNavbarBlur: (state, action) => {
      state.navbarBlur = action.payload;
      setCookie('navbarBlur', action.payload);
    },
    setNavbarTransparency: (state, action) => {
      state.navbarTransparency = action.payload;
      setCookie('navbarTransparency', action.payload);
    },
    setNavbarPosition: (state, action) => {
      state.navbarPosition = action.payload;
      setCookie('navbarPosition', action.payload);
    },
    setNavbarAnimations: (state, action) => {
      state.navbarAnimations = action.payload;
      setCookie('navbarAnimations', action.payload);
    },
    setNavbarHoverEffects: (state, action) => {
      state.navbarHoverEffects = action.payload;
      setCookie('navbarHoverEffects', action.payload);
    },
  },
});

export const {
  setOpenSidenav,
  setSidenavType,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDarkMode,
  setSidenavCollapsed,
  setSidenavFlatMenu,
  setSidenavExpandAll,
  setSidenavSize,
  setSidenavPosition,
  setNavbarColor,
  setNavbarHeight,
  setNavbarStyle,
  setNavbarShadow,
  setNavbarBorder,
  setNavbarBlur,
  setNavbarTransparency,
  setNavbarPosition,
  setNavbarAnimations,
  setNavbarHoverEffects,
} = uiSlice.actions;

export default uiSlice.reducer;


