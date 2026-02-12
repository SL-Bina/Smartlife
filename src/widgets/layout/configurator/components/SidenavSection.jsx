import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ConfiguratorSection } from "./ConfiguratorSection";
import { ConfiguratorSwitch } from "./ConfiguratorSwitch";
import {
  setSidenavCollapsed,
  setSidenavFlatMenu,
  setSidenavExpandAll,
  setSidenavSize,
  setSidenavPosition,
} from "@/store/exports";

export function SidenavSection({
  dispatch,
  isOpen,
  onToggle,
  sidenavCollapsed,
  sidenavFlatMenu,
  sidenavExpandAll,
  sidenavSize,
  sidenavPosition,
  openSections,
  setOpenSections,
}) {
  const { t } = useTranslation();

  const sidenavIcon = (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const collapsedIcon = (
    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );

  const flatMenuIcon = (
    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );

  const expandAllIcon = (
    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <ConfiguratorSection
      title={t("configurator.sections.sidenav.title")}
      icon={sidenavIcon}
      iconColor="from-blue-500 to-blue-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <ConfiguratorSwitch
        id="sidenav-collapsed"
        titleKey="configurator.sections.sidenav.collapsed.title"
        descriptionKey="configurator.sections.sidenav.collapsed.description"
        checked={sidenavCollapsed}
        onChange={() => setSidenavCollapsed(dispatch, !sidenavCollapsed)}
        icon={collapsedIcon}
        iconBgColor="bg-blue-50 dark:bg-blue-900/20"
        iconColor="text-blue-600 dark:text-blue-400"
      />

      <ConfiguratorSwitch
        id="sidenav-flat-menu"
        titleKey="configurator.sections.sidenav.flatMenu.title"
        descriptionKey="configurator.sections.sidenav.flatMenu.description"
        checked={sidenavFlatMenu}
        onChange={() => {
          const newValue = !sidenavFlatMenu;
          setSidenavFlatMenu(dispatch, newValue);
          if (newValue && sidenavExpandAll) {
            setSidenavExpandAll(dispatch, false);
          }
        }}
        icon={flatMenuIcon}
        iconBgColor="bg-purple-50 dark:bg-purple-900/20"
        iconColor="text-purple-600 dark:text-purple-400"
      />

      <ConfiguratorSwitch
        id="sidenav-expand-all"
        titleKey="configurator.sections.sidenav.expandAll.title"
        descriptionKey="configurator.sections.sidenav.expandAll.description"
        checked={sidenavExpandAll}
        onChange={() => {
          const newValue = !sidenavExpandAll;
          setSidenavExpandAll(dispatch, newValue);
          if (newValue && sidenavFlatMenu) {
            setSidenavFlatMenu(dispatch, false);
          }
        }}
        icon={expandAllIcon}
        iconBgColor="bg-green-50 dark:bg-green-900/20"
        iconColor="text-green-600 dark:text-green-400"
      />

      {/* Sidenav Size */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <button
          onClick={() => {
            if (setOpenSections) {
              setOpenSections((current) => ({
                ...current,
                sidenavSize: !current.sidenavSize,
              }));
            }
          }}
          className="w-full p-4 flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <Typography variant="small" className="font-semibold text-gray-900 dark:text-white text-sm">
                {t("configurator.sections.sidenav.size.title")}
              </Typography>
            </div>
            <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-10">
              {t("configurator.sections.sidenav.size.description")}
            </Typography>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${openSections?.sidenavSize ? "rotate-180" : ""
              } text-gray-400 dark:text-gray-500`}
          />
        </button>
        <AnimatePresence>
          {openSections?.sidenavSize && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-100 dark:border-gray-700"
            >
              <div className="p-3 space-y-2 bg-gray-50/50 dark:bg-gray-900/50">
                {["small", "medium", "large"].map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSidenavSize(dispatch, size)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${sidenavSize === size
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${sidenavSize === size
                        ? "bg-white/20"
                        : "bg-gray-200/50 dark:bg-gray-700/50"
                      }`}>
                      <div className={`w-3 h-3 rounded ${sidenavSize === size
                          ? "bg-white"
                          : size === "small"
                            ? "bg-gray-400 dark:bg-gray-500"
                            : size === "medium"
                              ? "bg-gray-500 dark:bg-gray-400"
                              : "bg-gray-600 dark:bg-gray-300"
                        }`} style={{
                          width: size === "small" ? "8px" : size === "medium" ? "12px" : "16px",
                          height: size === "small" ? "8px" : size === "medium" ? "12px" : "16px",
                        }}></div>
                    </div>
                    <Typography variant="small" className={`font-semibold text-sm ${sidenavSize === size ? "text-white" : "text-gray-700 dark:text-gray-300"
                      }`}>
                      {t(`configurator.sections.sidenav.size.options.${size}`)}
                    </Typography>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidenav Position */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <button
          onClick={() => {
            if (setOpenSections) {
              setOpenSections((current) => ({
                ...current,
                sidenavPosition: !current.sidenavPosition,
              }));
            }
          }}
          className="w-full p-4 flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <Typography variant="small" className="font-semibold text-gray-900 dark:text-white text-sm">
                {t("configurator.sections.sidenav.position.title")}
              </Typography>
            </div>
            <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-10">
              {t("configurator.sections.sidenav.position.description")}
            </Typography>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${openSections?.sidenavPosition ? "rotate-180" : ""
              } text-gray-400 dark:text-gray-500`}
          />
        </button>
        <AnimatePresence>
          {openSections?.sidenavPosition && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-100 dark:border-gray-700"
            >
              <div className="p-3 space-y-2 bg-gray-50/50 dark:bg-gray-900/50">
                {["left", "right"].map((position) => (
                  <motion.button
                    key={position}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSidenavPosition(dispatch, position)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${sidenavPosition === position
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${sidenavPosition === position
                        ? "bg-white/20"
                        : "bg-gray-200/50 dark:bg-gray-700/50"
                      }`}>
                      <svg className={`w-4 h-4 ${sidenavPosition === position
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                          transform: position === "right" ? "scaleX(-1)" : "none"
                        }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <Typography variant="small" className={`font-semibold text-sm ${sidenavPosition === position ? "text-white" : "text-gray-700 dark:text-gray-300"
                      }`}>
                      {t(`configurator.sections.sidenav.position.options.${position}`)}
                    </Typography>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ConfiguratorSection>
  );
}

