import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMaterialTailwindController, setOpenConfigurator } from "@/store/exports";
import { ConfiguratorHeader } from "./components/ConfiguratorHeader";
import { ConfiguratorToggleButton } from "./components/ConfiguratorToggleButton";
import { SidenavSection } from "./components/SidenavSection";
import { NavbarSection } from "./components/NavbarSection";
import { LayoutSection } from "./components/LayoutSection";

export function Configurator() {
  const [controller, dispatch] = useMaterialTailwindController();
  const {
    openConfigurator,
    fixedNavbar,
    sidenavCollapsed,
    sidenavFlatMenu,
    sidenavExpandAll,
    sidenavSize,
    sidenavPosition,
  } = controller;
  const [openSections, setOpenSections] = React.useState({
    sidenav: true,
    navbar: false,
    layout: false,
    sidenavSize: false,
    sidenavPosition: false,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <ConfiguratorToggleButton
        dispatch={dispatch}
        openConfigurator={openConfigurator}
        isMobile={isMobile}
        sidenavPosition={sidenavPosition}
      />

      {!isMobile && (
        <AnimatePresence>
          {openConfigurator && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50"
                onClick={() => setOpenConfigurator(dispatch, false)}
              />

              <motion.aside
                initial={{ 
                  x: sidenavPosition === "right" ? -400 : 400, 
                  opacity: 0 
                }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                }}
                exit={{ 
                  x: sidenavPosition === "right" ? -400 : 400, 
                  opacity: 0 
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className={`fixed inset-y-0 ${sidenavPosition === "right" ? "left-0" : "right-0"} z-50 w-[420px] bg-white dark:bg-gray-900 shadow-2xl ${
                  sidenavPosition === "right" ? "border-r" : "border-l"
                } border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col`}
              >
                <ConfiguratorHeader dispatch={dispatch} />

                {/* Content */}
                <div className="py-6 px-6 overflow-y-auto flex-1 custom-sidenav-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="space-y-3">
                    <SidenavSection
                      dispatch={dispatch}
                      isOpen={openSections.sidenav}
                      onToggle={() => {
                        setOpenSections((current) => ({
                          ...current,
                          sidenav: !current.sidenav,
                        }));
                      }}
                      sidenavCollapsed={sidenavCollapsed}
                      sidenavFlatMenu={sidenavFlatMenu}
                      sidenavExpandAll={sidenavExpandAll}
                      sidenavSize={sidenavSize}
                      sidenavPosition={sidenavPosition}
                      openSections={openSections}
                      setOpenSections={setOpenSections}
                    />

                    <NavbarSection
                      dispatch={dispatch}
                      isOpen={openSections.navbar}
                      onToggle={() => {
                        setOpenSections((current) => ({
                          ...current,
                          navbar: !current.navbar,
                        }));
                      }}
                      fixedNavbar={fixedNavbar}
                      openSections={openSections}
                      setOpenSections={setOpenSections}
                    />

                    <LayoutSection
                      isOpen={openSections.layout}
                      onToggle={() => {
                        setOpenSections((current) => ({
                          ...current,
                          layout: !current.layout,
                        }));
                      }}
                    />
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

Configurator.displayName = "/src/widgets/layout/configurator/index.jsx";

export default Configurator;

