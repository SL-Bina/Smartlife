import { useAppDispatch, useAppSelector } from '../hooks';
import {
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
} from '../slices/uiSlice';

export function useMaterialTailwindController() {
  const dispatch = useAppDispatch();
  const controller = useAppSelector((state) => state.ui);

  const actions = {
    setOpenSidenav: (value) => dispatch(setOpenSidenav(value)),
    setSidenavType: (value) => dispatch(setSidenavType(value)),
    setSidenavColor: (value) => dispatch(setSidenavColor(value)),
    setTransparentNavbar: (value) => dispatch(setTransparentNavbar(value)),
    setFixedNavbar: (value) => dispatch(setFixedNavbar(value)),
    setOpenConfigurator: (value) => dispatch(setOpenConfigurator(value)),
    setDarkMode: (value) => dispatch(setDarkMode(value)),
    setSidenavCollapsed: (value) => dispatch(setSidenavCollapsed(value)),
    setSidenavFlatMenu: (value) => dispatch(setSidenavFlatMenu(value)),
    setSidenavExpandAll: (value) => dispatch(setSidenavExpandAll(value)),
    setSidenavSize: (value) => dispatch(setSidenavSize(value)),
    setSidenavPosition: (value) => dispatch(setSidenavPosition(value)),
    setNavbarColor: (value) => dispatch(setNavbarColor(value)),
    setNavbarHeight: (value) => dispatch(setNavbarHeight(value)),
    setNavbarStyle: (value) => dispatch(setNavbarStyle(value)),
    setNavbarShadow: (value) => dispatch(setNavbarShadow(value)),
    setNavbarBorder: (value) => dispatch(setNavbarBorder(value)),
    setNavbarBlur: (value) => dispatch(setNavbarBlur(value)),
    setNavbarTransparency: (value) => dispatch(setNavbarTransparency(value)),
    setNavbarPosition: (value) => dispatch(setNavbarPosition(value)),
    setNavbarAnimations: (value) => dispatch(setNavbarAnimations(value)),
    setNavbarHoverEffects: (value) => dispatch(setNavbarHoverEffects(value)),
  };

  return [controller, actions];
}


