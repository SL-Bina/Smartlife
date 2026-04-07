import React from "react";
import PropTypes from "prop-types";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { motion, AnimatePresence } from "framer-motion";
import { SidenavHeader } from "./components/SidenavHeader";
import { SidenavMenu } from "./components/SidenavMenu";
import { getFirstActivePath } from "@/utils/getFirstActivePath";

import { useSelector } from "react-redux";
import { useAuth } from "@/store/hooks/useAuth";
import { useComplexColor } from "@/hooks/useComplexColor";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { useAppDispatch } from "@/store/hooks";
import { loadMtkById } from "@/store/slices/management/mtkSlice";

export function Sidenav({ brandImg, brandName, routes }) {
  const dispatch = useAppDispatch();
  const [controller, actions] = useMaterialTailwindController();
  const { sidenavType, openSidenav, sidenavCollapsed, sidenavFlatMenu, sidenavExpandAll, sidenavSize, sidenavPosition, darkMode } = controller;
  
  const { user } = useAuth();
  const selectedProperty = useSelector((state) => state.property.selectedProperty);
  const selectedMtkId = useSelector((state) => state.mtk.selectedMtkId);
  const selectedMtk = useSelector((state) => state.mtk.selectedMtk);

  const displayName =
    selectedMtk?.name ||
    selectedProperty?.sub_data?.mtk?.name ||
    selectedProperty?.mtk?.name ||
    brandName;

  const displayLogo =
    selectedMtk?.meta?.logo ||
    selectedProperty?.sub_data?.mtk?.meta?.logo ||
    selectedProperty?.mtk?.meta?.logo ||
    brandImg;

  // Resident → complex color, Dashboard → MTK color
  const RESIDENT_DEFAULT = "#3b82f6";
  const DASHBOARD_DEFAULT = "#dc2626";
  const { color: residentColor } = useComplexColor();
  const { colorCode: mtkColor } = useMtkColor();

  const rawColor = user?.is_resident ? residentColor : mtkColor;
  const defaultColor = user?.is_resident ? RESIDENT_DEFAULT : DASHBOARD_DEFAULT;
  const mtkColorCode = rawColor && rawColor !== defaultColor ? rawColor : null;

  const filteredRoutes = routes;
  const homePath = getFirstActivePath(filteredRoutes);

  const [openMenus, setOpenMenus] = React.useState({});
  const [isMobile, setIsMobile] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLowHeight, setIsLowHeight] = React.useState(false);

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getSidenavBackground = () => {
    if (isMobile) {
      return {
        background: darkMode ? "#1f2937" : "#ffffff",
      };
    }

    if (mtkColorCode && sidenavType === "white") {
      const color1 = getRgbaColor(mtkColorCode, isMobile ? 0.96 : 0.1);
      const color2 = getRgbaColor(mtkColorCode, isMobile ? 0.92 : 0.05);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    if (mtkColorCode && sidenavType === "dark") {
      const color1 = getRgbaColor(mtkColorCode, isMobile ? 0.98 : 0.2);
      const color2 = getRgbaColor(mtkColorCode, isMobile ? 0.95 : 0.15);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    return {};
  };

  const sidenavTypes = {
    dark: mtkColorCode ? "" : "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900",
    white: mtkColorCode ? "" : "bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    transparent: "bg-transparent",
  };

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    const checkLowHeight = () => setIsLowHeight(window.innerHeight < 700);
    checkMobile();
    checkLowHeight();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("resize", checkLowHeight);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("resize", checkLowHeight);
    };
  }, []);

  const sizeMap = { small: 240, medium: 320, large: 400 };

  const getSidenavWidth = () => {
    if (isMobile) return 288;
    if (sidenavCollapsed) return isHovered ? (sizeMap[sidenavSize] || 320) : 80;
    return sizeMap[sidenavSize] || 320;
  };

  React.useEffect(() => {
    if (openSidenav && isMobile) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [openSidenav, isMobile]);

  React.useEffect(() => {
    if (!user || user?.is_resident === true) return;

    if (selectedMtkId && !selectedMtk) {
      dispatch(loadMtkById(selectedMtkId));
    }
  }, [dispatch, selectedMtkId, selectedMtk, user]);

  return (
    <>
      <AnimatePresence>
        {openSidenav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/50 dark:bg-black/80 z-[999] xl:hidden"
            onClick={() => actions.setOpenSidenav(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (openSidenav ? 0 : -288) : 0,
          width: getSidenavWidth(),
          left: sidenavPosition === "right" ? "auto" : 0,
          right: sidenavPosition === "right" ? 0 : "auto",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={() => { if (!isMobile && sidenavCollapsed) setIsHovered(true); }}
        onMouseLeave={() => { if (!isMobile && sidenavCollapsed) setIsHovered(false); }}
        className={`${isMobile ? (darkMode ? "bg-gray-800" : "bg-white") : sidenavTypes[sidenavType]} fixed inset-y-0 ${sidenavPosition === "right" ? "right-0" : "left-0"} xl:translate-x-0 flex flex-col ${isMobile ? "" : "backdrop-blur-xl"} ${sidenavPosition === "right" ? "border-l" : "border-r"} shadow-2xl ${
          sidenavCollapsed && !isHovered ? "xl:overflow-hidden" : "overflow-y-auto"
        }`}
        style={{
          ...getSidenavBackground(),
          borderColor: mtkColorCode ? getRgbaColor(mtkColorCode, 0.3) : undefined,
          zIndex: isMobile ? 1100 : 1000,
          isolation: 'isolate', 
        }}
      >
        <SidenavHeader
          brandName={displayName}
          brandLogo={displayLogo}
          collapsed={sidenavCollapsed && !isHovered}
          isLowHeight={isLowHeight}
          homePath={homePath}
        />

        <SidenavMenu
          routes={filteredRoutes}
          openMenus={openMenus}
          setOpenMenus={setOpenMenus}
          collapsed={sidenavCollapsed && !isHovered}
          flatMenu={sidenavFlatMenu}
          expandAll={sidenavExpandAll}
          isLowHeight={isLowHeight}
        />
      </motion.aside>
    </>
  );}

Sidenav.defaultProps = {
  brandImg: "/Site_Logo/color_big.png",
  brandName: "SmartLife",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
