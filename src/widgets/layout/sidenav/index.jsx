import React from "react";
import PropTypes from "prop-types";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { motion, AnimatePresence } from "framer-motion";
import { SidenavHeader } from "./components/SidenavHeader";
import { SidenavMenu } from "./components/SidenavMenu";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, openSidenav, sidenavCollapsed, sidenavFlatMenu, sidenavExpandAll, sidenavSize, sidenavPosition } = controller;
  const [openMenus, setOpenMenus] = React.useState({});
  const [isMobile, setIsMobile] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const sidenavTypes = {
    dark: "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900",
    white: "bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    transparent: "bg-transparent",
  };

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Size mapping
  const sizeMap = {
    small: 240,
    medium: 320,
    large: 400,
  };

  const getSidenavWidth = () => {
    if (isMobile) return 288;
    if (sidenavCollapsed) {
      return isHovered ? sizeMap[sidenavSize] || 320 : 80;
    }
    return sizeMap[sidenavSize] || 320;
  };

  const getCollapsedWidth = () => {
    return isHovered ? sizeMap[sidenavSize] || 320 : 80;
  };

  React.useEffect(() => {
    if (openSidenav && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 xl:hidden backdrop-blur-sm"
            onClick={() => setOpenSidenav(dispatch, false)}
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
        transition={
          isMobile
            ? {
                type: "spring",
                stiffness: 300,
                damping: 30,
              }
            : {
                type: "spring",
                stiffness: 300,
                damping: 30,
              }
        }
        onMouseEnter={() => {
          if (!isMobile && sidenavCollapsed) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile && sidenavCollapsed) {
            setIsHovered(false);
          }
        }}
        className={`${sidenavTypes[sidenavType]} fixed inset-y-0 ${
          sidenavPosition === "right" ? "right-0" : "left-0"
        } ${
          sidenavCollapsed && isHovered ? "z-[60]" : "z-50"
        } xl:translate-x-0 flex flex-col backdrop-blur-xl ${
          sidenavPosition === "right" ? "border-l" : "border-r"
        } border-gray-200/50 dark:border-gray-700/50 shadow-2xl ${
          sidenavCollapsed && !isHovered ? "xl:overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <SidenavHeader brandName={brandName} collapsed={sidenavCollapsed && !isHovered} />
        <SidenavMenu 
          routes={routes} 
          openMenus={openMenus} 
          setOpenMenus={setOpenMenus} 
          collapsed={sidenavCollapsed && !isHovered}
          flatMenu={sidenavFlatMenu}
          expandAll={sidenavExpandAll}
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
};

Sidenav.displayName = "/src/widgets/layout/sidenav/index.jsx";

export default Sidenav;
