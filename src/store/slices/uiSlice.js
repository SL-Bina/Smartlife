import {
  createUiPreferencesSlice,
  getInitialPreferenceBool,
  getInitialPreferenceValue,
} from './utils/createUiPreferencesSlice';

const initialState = {
  openSidenav: false,
  sidenavColor: 'dark',
  sidenavType: 'white',
  transparentNavbar: true,
  fixedNavbar: getInitialPreferenceBool('fixedNavbar', true), // Default: true (sabit navbar)
  openConfigurator: false,
  darkMode: getInitialPreferenceBool('darkMode', false),
  sidenavCollapsed: getInitialPreferenceBool('sidenavCollapsed', false),
  sidenavFlatMenu: getInitialPreferenceBool('sidenavFlatMenu', false),
  sidenavExpandAll: getInitialPreferenceBool('sidenavExpandAll', false),
  sidenavSize: getInitialPreferenceValue('sidenavSize', 'medium'),
  sidenavPosition: getInitialPreferenceValue('sidenavPosition', 'left'),
  navbarColor: getInitialPreferenceValue('navbarColor', 'default'),
  navbarHeight: getInitialPreferenceValue('navbarHeight', 'normal'),
  navbarStyle: getInitialPreferenceValue('navbarStyle', 'modern'),
  navbarShadow: getInitialPreferenceValue('navbarShadow', 'large'), // Default: 'large' (shadow large)
  navbarBorder: getInitialPreferenceValue('navbarBorder', 'enabled'),
  navbarBlur: getInitialPreferenceValue('navbarBlur', 'enabled'),
  navbarTransparency: getInitialPreferenceValue('navbarTransparency', '95'),
  navbarPosition: getInitialPreferenceValue('navbarPosition', 'top'),
  navbarAnimations: getInitialPreferenceValue('navbarAnimations', 'enabled'),
  navbarHoverEffects: getInitialPreferenceValue('navbarHoverEffects', 'disabled'), // Default: 'disabled' (hover effekt disable)
};

const uiSlice = createUiPreferencesSlice({
  name: 'ui',
  initialState,
  reducersConfig: {
    setOpenSidenav: { stateKey: 'openSidenav' },
    setSidenavType: { stateKey: 'sidenavType' },
    setSidenavColor: { stateKey: 'sidenavColor' },
    setTransparentNavbar: { stateKey: 'transparentNavbar' },
    setFixedNavbar: { stateKey: 'fixedNavbar', persistKey: 'fixedNavbar' },
    setOpenConfigurator: { stateKey: 'openConfigurator' },
    setDarkMode: {
      stateKey: 'darkMode',
      persistKey: 'darkMode',
      onSet: ({ value }) => {
        if (typeof window === 'undefined') return;
        if (value) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    },
    setSidenavCollapsed: { stateKey: 'sidenavCollapsed', persistKey: 'sidenavCollapsed' },
    setSidenavFlatMenu: { stateKey: 'sidenavFlatMenu', persistKey: 'sidenavFlatMenu' },
    setSidenavExpandAll: { stateKey: 'sidenavExpandAll', persistKey: 'sidenavExpandAll' },
    setSidenavSize: { stateKey: 'sidenavSize', persistKey: 'sidenavSize' },
    setSidenavPosition: { stateKey: 'sidenavPosition', persistKey: 'sidenavPosition' },
    setNavbarColor: { stateKey: 'navbarColor', persistKey: 'navbarColor' },
    setNavbarHeight: { stateKey: 'navbarHeight', persistKey: 'navbarHeight' },
    setNavbarStyle: { stateKey: 'navbarStyle', persistKey: 'navbarStyle' },
    setNavbarShadow: { stateKey: 'navbarShadow', persistKey: 'navbarShadow' },
    setNavbarBorder: { stateKey: 'navbarBorder', persistKey: 'navbarBorder' },
    setNavbarBlur: { stateKey: 'navbarBlur', persistKey: 'navbarBlur' },
    setNavbarTransparency: { stateKey: 'navbarTransparency', persistKey: 'navbarTransparency' },
    setNavbarPosition: { stateKey: 'navbarPosition', persistKey: 'navbarPosition' },
    setNavbarAnimations: { stateKey: 'navbarAnimations', persistKey: 'navbarAnimations' },
    setNavbarHoverEffects: { stateKey: 'navbarHoverEffects', persistKey: 'navbarHoverEffects' },
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


