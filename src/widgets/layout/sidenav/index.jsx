import React from "react";
import PropTypes from "prop-types";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { motion, AnimatePresence } from "framer-motion";
import { SidenavHeader } from "./components/SidenavHeader";
import { SidenavMenu } from "./components/SidenavMenu";

export function Sidenav({ brandImg, brandName, routes, homePath }) {
  const [controller, actions] = useMaterialTailwindController();
  const { sidenavType, openSidenav, sidenavCollapsed, sidenavFlatMenu, sidenavExpandAll, sidenavSize, sidenavPosition } = controller;
  
  const colorCode = null;
  const mtkColorCode = null;

  const filteredRoutes = routes;

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
    if (mtkColorCode && sidenavType === "white") {
      const color1 = getRgbaColor(mtkColorCode, 0.1);
      const color2 = getRgbaColor(mtkColorCode, 0.05);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    if (mtkColorCode && sidenavType === "dark") {
      const color1 = getRgbaColor(mtkColorCode, 0.2);
      const color2 = getRgbaColor(mtkColorCode, 0.15);
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

  return (
    <>
      <AnimatePresence>
        {openSidenav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[999] xl:hidden backdrop-blur-sm"
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
        className={`${sidenavTypes[sidenavType]} fixed inset-y-0 ${sidenavPosition === "right" ? "right-0" : "left-0"} xl:translate-x-0 flex flex-col backdrop-blur-xl ${sidenavPosition === "right" ? "border-l" : "border-r"} shadow-2xl ${
          sidenavCollapsed && !isHovered ? "xl:overflow-hidden" : "overflow-y-auto"
        }`}
        style={{
          ...getSidenavBackground(),
          borderColor: mtkColorCode ? getRgbaColor(mtkColorCode, 0.3) : undefined,
          zIndex: 1000, // Sidebar z-index - modallardan aşağı olmalıdır
          isolation: 'isolate', // Yeni stacking context yaradır
        }}
      >
        <SidenavHeader brandName={brandName} collapsed={sidenavCollapsed && !isHovered} isLowHeight={isLowHeight} homePath={homePath} />

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
  );
}

Sidenav.defaultProps = {
  brandImg: "/Site_Logo/color_big.png",
  brandName: "SmartLife",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  homePath: PropTypes.string,
};

export default Sidenav;
