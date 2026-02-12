import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ConfiguratorSection } from "./ConfiguratorSection";
import { ConfiguratorSwitch } from "./ConfiguratorSwitch";
import {
  setFixedNavbar,
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
  useMaterialTailwindController,
} from "@/store/exports";

export function NavbarSection({
  dispatch,
  isOpen,
  onToggle,
  fixedNavbar,
  openSections,
  setOpenSections,
}) {
  const { t } = useTranslation();
  const [controller] = useMaterialTailwindController();
  const {
    navbarColor,
    navbarHeight,
    navbarStyle,
    navbarShadow,
    navbarBorder,
    navbarBlur,
    navbarTransparency,
    navbarPosition,
    navbarAnimations,
    navbarHoverEffects,
  } = controller;

  const navbarIcon = (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const fixedIcon = (
    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14M5 12h14M5 19h14" />
    </svg>
  );

  const transparentIcon = (
    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const sizeIcon = (
    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );

  return (
    <ConfiguratorSection
      title={t("configurator.sections.navbar.title")}
      icon={navbarIcon}
      iconColor="from-indigo-500 to-indigo-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <ConfiguratorSwitch
        id="navbar-fixed"
        titleKey="configurator.sections.navbar.fixed.title"
        descriptionKey="configurator.sections.navbar.fixed.description"
        checked={fixedNavbar}
        onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
        icon={fixedIcon}
        iconBgColor="bg-indigo-50 dark:bg-indigo-900/20"
        iconColor="text-indigo-600 dark:text-indigo-400"
      />

      <ConfiguratorSwitch
        id="navbar-transparent"
        titleKey="configurator.sections.navbar.transparent.title"
        descriptionKey="configurator.sections.navbar.transparent.description"
        checked={true}
        onChange={() => {}}
        icon={transparentIcon}
        iconBgColor="bg-gray-100 dark:bg-gray-700"
        iconColor="text-gray-400 dark:text-gray-500"
        disabled={true}
        opacity={true}
      />

      {/* Navbar Configurations */}
      {[
        { 
          id: "navbar-color", 
          title: "Navbar Rəngi", 
          description: "Navbar-ın əsas rəngini seçin", 
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          ), 
          color: "from-blue-500 to-indigo-600",
          options: ["default", "red", "blue", "green", "purple"],
          currentValue: navbarColor,
          setValue: (value) => setNavbarColor(dispatch, value),
        },
        { 
          id: "navbar-height", 
          title: "Navbar Hündürlüyü", 
          description: "Navbar-ın hündürlüyünü tənzimləyin", 
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          ), 
          color: "from-purple-500 to-violet-600",
          options: ["compact", "normal", "large"],
          currentValue: navbarHeight,
          setValue: (value) => setNavbarHeight(dispatch, value),
        },
        { 
          id: "navbar-style", 
          title: "Navbar Stili", 
          description: "Navbar-ın ümumi stilini seçin", 
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          ), 
          color: "from-cyan-500 to-blue-600",
          options: ["minimalist", "modern", "classic"],
          currentValue: navbarStyle,
          setValue: (value) => setNavbarStyle(dispatch, value),
        },
        { 
          id: "navbar-shadow", 
          title: "Navbar Shadow", 
          description: "Navbar-ın shadow (kölgə) effektini tənzimləyin", 
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ), 
          color: "from-emerald-500 to-teal-600",
          options: ["none", "small", "medium", "large"],
          currentValue: navbarShadow,
          setValue: (value) => setNavbarShadow(dispatch, value),
        },
        { 
          id: "navbar-border", 
          title: "Navbar Border", 
          description: "Navbar-ın border stilini tənzimləyin", 
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          ), 
          color: "from-amber-500 to-orange-600",
          options: ["enabled", "disabled"],
          currentValue: navbarBorder,
          setValue: (value) => setNavbarBorder(dispatch, value),
        },
        { 
          id: "navbar-blur", 
          title: "Navbar Blur Effect", 
          description: "Navbar-ın blur (bulanıqlıq) effektini tənzimləyin", 
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ), 
          color: "from-lime-500 to-green-600",
          options: ["enabled", "disabled"],
          currentValue: navbarBlur,
          setValue: (value) => setNavbarBlur(dispatch, value),
        },
        { 
          id: "navbar-transparency", 
          title: "Navbar Transparency", 
          description: "Navbar-ın şəffaflıq dərəcəsini tənzimləyin", 
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ), 
          color: "from-sky-500 to-cyan-600",
          options: ["50", "70", "85", "95", "100"],
          currentValue: navbarTransparency,
          setValue: (value) => setNavbarTransparency(dispatch, value),
        },
        { 
          id: "navbar-position", 
          title: "Navbar Mövqeyi", 
          description: "Navbar-ın mövqeyini seçin", 
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ), 
          color: "from-fuchsia-500 to-pink-600",
          options: ["top", "bottom"],
          currentValue: navbarPosition,
          setValue: (value) => setNavbarPosition(dispatch, value),
        },
        { 
          id: "navbar-animations", 
          title: "Navbar Animasiyaları", 
          description: "Navbar-ın scroll və hover animasiyalarını tənzimləyin", 
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ), 
          color: "from-indigo-500 to-purple-600",
          options: ["enabled", "disabled"],
          currentValue: navbarAnimations,
          setValue: (value) => setNavbarAnimations(dispatch, value),
        },
        { 
          id: "navbar-hover-effects", 
          title: "Navbar Hover Effects", 
          description: "Navbar elementlərinin hover effektlərini tənzimləyin", 
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          ), 
          color: "from-red-500 to-pink-600",
          options: ["enabled", "disabled"],
          currentValue: navbarHoverEffects,
          setValue: (value) => setNavbarHoverEffects(dispatch, value),
        },
      ].map((config) => {
        const isOpen = openSections?.[config.id] || false;
        return (
          <div key={config.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <button
              onClick={() => {
                if (setOpenSections) {
                  setOpenSections((current) => ({
                    ...current,
                    [config.id]: !current[config.id],
                  }));
                }
              }}
              className="w-full p-4 flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                    {config.icon}
                  </div>
                  <Typography variant="small" className="font-semibold text-gray-900 dark:text-white text-sm">
                    {config.title}
                  </Typography>
                </div>
                <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-10">
                  {config.description}
                </Typography>
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                  } text-gray-400 dark:text-gray-500`}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-gray-100 dark:border-gray-700"
                >
                  <div className="p-3 space-y-2 bg-gray-50/50 dark:bg-gray-900/50">
                    {config.options?.map((option) => (
                      <motion.button
                        key={option}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => config.setValue(option)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          config.currentValue === option
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                          config.currentValue === option
                            ? "bg-white/20"
                            : "bg-gray-200/50 dark:bg-gray-700/50"
                        }`}>
                          {config.currentValue === option && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <Typography variant="small" className={`font-semibold text-sm ${
                          config.currentValue === option ? "text-white" : "text-gray-700 dark:text-gray-300"
                        }`}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Typography>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </ConfiguratorSection>
  );
}

