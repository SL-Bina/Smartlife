import React from "react";
import PropTypes from "prop-types";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { motion, AnimatePresence } from "framer-motion";
import { SidenavHeader } from "./components/SidenavHeader";
import { SidenavMenu } from "./components/SidenavMenu";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, openSidenav } = controller;
  const [openMenus, setOpenMenus] = React.useState({});
  const [isMobile, setIsMobile] = React.useState(false);

  const sidenavTypes = {
    dark: "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900",
    white: "bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    transparent: "bg-transparent",
  };

  // Check if mobile view
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when sidenav is open on mobile
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
      {/* Backdrop Overlay - Mobile Only */}
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

      {/* Sidenav */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (openSidenav ? 0 : -288) : 0,
        }}
        transition={
          isMobile
            ? {
                type: "spring",
                stiffness: 300,
                damping: 30,
              }
            : { duration: 0 }
        }
        className={`${sidenavTypes[sidenavType]} fixed inset-y-0 left-0 z-50 w-72 xl:w-80 xl:translate-x-0 flex flex-col backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl`}
      >
        <SidenavHeader brandName={brandName} />
        <SidenavMenu routes={routes} openMenus={openMenus} setOpenMenus={setOpenMenus} />
      </motion.aside>
    </>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "SmartLife",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidenav/index.jsx";

export default Sidenav;
