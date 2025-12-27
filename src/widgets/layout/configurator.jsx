import React from "react";
import { XMarkIcon, Cog6ToothIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  IconButton,
  Switch,
  Typography,
} from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setSidenavColor,
  setSidenavType,
  setFixedNavbar,
  setSidenavCollapsed,
} from "@/context";

export function Configurator() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openConfigurator, sidenavColor, sidenavType, fixedNavbar, sidenavCollapsed } =
    controller;
  const [openSections, setOpenSections] = React.useState({ sidenav: true, navbar: false });

  const sidenavColors = {
    white: "from-gray-100 to-gray-100 border-gray-200",
    dark: "from-black to-black border-gray-200",
    green: "from-green-400 to-green-600",
    orange: "from-orange-400 to-orange-600",
    red: "from-red-400 to-red-600",
    pink: "from-pink-400 to-pink-600",
  };

  const sidenavTypes = {
    dark: "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900",
    white: "bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    transparent: "bg-transparent",
  };

  // React.useEffect(() => {
  //   fetch("https://api.github.com/repos/creativetimofficial/SmartLife")
  //     .then((response) => (response.ok ? response.json() : null))
  //     .then((data) => {
  //       if (data && typeof data.stargazers_count === "number") {
  //         setStars(formatNumber(data.stargazers_count, 1));
  //       }
  //     })
  //     .catch(() => {});
  // }, []);

  return (
    <>
      {/* Fixed button in bottom right */}
      <motion.div
        initial={false}
        animate={{
          scale: openConfigurator ? 0 : 1,
          opacity: openConfigurator ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="fixed bottom-6 right-6 z-50"
      >
        <IconButton
          variant="gradient"
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-6 w-6 text-white" />
        </IconButton>
      </motion.div>

      {/* Configurator panel - fixed when open */}
      <AnimatePresence>
        {openConfigurator && (
          <>
            {/* Invisible backdrop - click outside to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpenConfigurator(dispatch, false)}
            />
            
            <motion.aside
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className={`fixed inset-y-0 right-0 z-50 w-96 ${sidenavTypes[sidenavType]} shadow-2xl backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col`}
            >
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-red-600/5 via-red-500/3 to-transparent dark:from-red-600/10 dark:via-red-500/5 dark:to-transparent">
                <div>
                  <Typography variant="h5" className="font-bold text-base xl:text-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    Dashboard Configurator
                  </Typography>
                  <Typography className="font-normal text-xs xl:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    See our dashboard options.
                  </Typography>
                </div>
                <IconButton
                  variant="text"
                  size="sm"
                  ripple={false}
                  onClick={() => setOpenConfigurator(dispatch, false)}
                  className="!p-2 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-lg transition-all duration-200 hover:scale-110 text-gray-700 dark:text-gray-300"
                >
                  <XMarkIcon strokeWidth={2.5} className="h-5 w-5" />
                </IconButton>
              </div>
              <div className="py-4 px-6 overflow-y-auto flex-1 custom-sidenav-scrollbar">
                <ul className="space-y-0.5">
                  {/* Sidenav Section */}
                  <li>
                    <motion.div
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <button
                        onClick={() => {
                          setOpenSections((current) => ({
                            ...current,
                            sidenav: !current.sidenav,
                          }));
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2 py-2.5 rounded-lg transition-all duration-200 group ${
                          openSections.sidenav
                            ? "bg-gray-100/50 dark:bg-gray-800/30 text-gray-900 dark:text-gray-100"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              openSections.sidenav
                                ? "bg-gray-200/50 dark:bg-gray-700/50"
                                : "bg-gray-200/50 dark:bg-gray-700/50 group-hover:bg-gray-300/50 dark:group-hover:bg-gray-600/50"
                            }`}
                          >
                            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                          </div>
                          <Typography
                            variant="small"
                            className="font-semibold text-sm truncate"
                          >
                            Sidenav
                          </Typography>
                        </div>
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                            openSections.sidenav ? "rotate-180" : ""
                          } text-gray-500 dark:text-gray-400`}
                        />
                      </button>
                    </motion.div>

                    <AnimatePresence>
                      {openSections.sidenav && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-1 ml-3 pl-3 border-l-2 border-gray-200 dark:border-gray-700 space-y-0.5">
                            {/* Colors Submenu - Commented out for now */}
                            {/* <li>
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <button
                                  onClick={() => {
                                    setOpenSections((current) => ({
                                      ...current,
                                      sidenavColors: !current.sidenavColors,
                                    }));
                                  }}
                                  className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200"
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center bg-gray-200/30 dark:bg-gray-700/30">
                                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-600"></div>
                                    </div>
                                    <Typography variant="small" className="text-xs font-medium truncate">
                                      Colors
                                    </Typography>
                                  </div>
                                  <ChevronDownIcon
                                    className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${
                                      openSections.sidenavColors ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>
                              </motion.div>
                              <AnimatePresence>
                                {openSections.sidenavColors && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-1 ml-4 pl-3 py-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {Object.keys(sidenavColors).map((color) => (
                                          <motion.span
                                            key={color}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`h-8 w-8 cursor-pointer rounded-full border-2 bg-gradient-to-br transition-all duration-200 shadow-md hover:shadow-lg ${
                                              sidenavColors[color]
                                            } ${
                                              sidenavColor === color ? "border-red-600 dark:border-red-500 ring-2 ring-red-500/30" : "border-gray-300 dark:border-gray-600"
                                            }`}
                                            onClick={() => setSidenavColor(dispatch, color)}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </li> */}

                            {/* Types Submenu - Commented out for now */}
                            {/* <li>
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <button
                                  onClick={() => {
                                    setOpenSections((current) => ({
                                      ...current,
                                      sidenavTypes: !current.sidenavTypes,
                                    }));
                                  }}
                                  className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200"
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center bg-gray-200/30 dark:bg-gray-700/30">
                                      <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                      </svg>
                                    </div>
                                    <Typography variant="small" className="text-xs font-medium truncate">
                                      Types
                                    </Typography>
                                  </div>
                                  <ChevronDownIcon
                                    className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${
                                      openSections.sidenavTypes ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>
                              </motion.div>
                              <AnimatePresence>
                                {openSections.sidenavTypes && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-1 ml-4 pl-3 py-2 space-y-2">
                                      <motion.button
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSidenavType(dispatch, "dark")}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                          sidenavType === "dark"
                                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30"
                                            : "bg-gray-100/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/30"
                                        }`}
                                      >
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                                          sidenavType === "dark"
                                            ? "bg-white/20"
                                            : "bg-gray-200/50 dark:bg-gray-700/50"
                                        }`}>
                                          <div className="w-2.5 h-2.5 rounded bg-gray-900 dark:bg-gray-100"></div>
                                        </div>
                                        <Typography variant="small" className={`font-semibold text-xs ${
                                          sidenavType === "dark" ? "text-white" : "text-gray-700 dark:text-gray-300"
                                        }`}>
                                          Dark
                                        </Typography>
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSidenavType(dispatch, "transparent")}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                          sidenavType === "transparent"
                                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30"
                                            : "bg-gray-100/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/30"
                                        }`}
                                      >
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                                          sidenavType === "transparent"
                                            ? "bg-white/20"
                                            : "bg-gray-200/50 dark:bg-gray-700/50"
                                        }`}>
                                          <div className="w-2.5 h-2.5 rounded border-2 border-gray-400 dark:border-gray-500"></div>
                                        </div>
                                        <Typography variant="small" className={`font-semibold text-xs ${
                                          sidenavType === "transparent" ? "text-white" : "text-gray-700 dark:text-gray-300"
                                        }`}>
                                          Transparent
                                        </Typography>
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSidenavType(dispatch, "white")}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                          sidenavType === "white"
                                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30"
                                            : "bg-gray-100/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/30"
                                        }`}
                                      >
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                                          sidenavType === "white"
                                            ? "bg-white/20"
                                            : "bg-gray-200/50 dark:bg-gray-700/50"
                                        }`}>
                                          <div className="w-2.5 h-2.5 rounded bg-white dark:bg-gray-100 border border-gray-200"></div>
                                        </div>
                                        <Typography variant="small" className={`font-semibold text-xs ${
                                          sidenavType === "white" ? "text-white" : "text-gray-700 dark:text-gray-300"
                                        }`}>
                                          White
                                        </Typography>
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </li> */}

                            {/* Sidenav Collapsed Submenu */}
                            <li>
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <div className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center bg-gray-200/30 dark:bg-gray-700/30">
                                      <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                      </svg>
                                    </div>
                                    <Typography variant="small" className="text-xs font-medium truncate">
                                      Collapsed
                                    </Typography>
                                  </div>
                                  <Switch
                                    id="sidenav-collapsed"
                                    value={sidenavCollapsed}
                                    onChange={() => setSidenavCollapsed(dispatch, !sidenavCollapsed)}
                                  />
                                </div>
                              </motion.div>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>

                  {/* Navbar Section */}
                  <li>
                    <motion.div
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <button
                        onClick={() => {
                          setOpenSections((current) => ({
                            ...current,
                            navbar: !current.navbar,
                          }));
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2 py-2.5 rounded-lg transition-all duration-200 group ${
                          openSections.navbar
                            ? "bg-gray-100/50 dark:bg-gray-800/30 text-gray-900 dark:text-gray-100"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              openSections.navbar
                                ? "bg-gray-200/50 dark:bg-gray-700/50"
                                : "bg-gray-200/50 dark:bg-gray-700/50 group-hover:bg-gray-300/50 dark:group-hover:bg-gray-600/50"
                            }`}
                          >
                            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </div>
                          <Typography
                            variant="small"
                            className="font-semibold text-sm truncate"
                          >
                            Navbar
                          </Typography>
                        </div>
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                            openSections.navbar ? "rotate-180" : ""
                          } text-gray-500 dark:text-gray-400`}
                        />
                      </button>
                    </motion.div>

                    <AnimatePresence>
                      {openSections.navbar && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-1 ml-3 pl-3 border-l-2 border-gray-200 dark:border-gray-700 space-y-0.5">
                            {/* Navbar Fixed Submenu */}
                            <li>
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <div className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center bg-gray-200/30 dark:bg-gray-700/30">
                                      <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14M5 12h14M5 19h14" />
                                      </svg>
                                    </div>
                                    <Typography variant="small" className="text-xs font-medium truncate">
                                      Fixed
                                    </Typography>
                                  </div>
                                  <Switch
                                    id="navbar-fixed"
                                    value={fixedNavbar}
                                    onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
                                  />
                                </div>
                              </motion.div>
                            </li>

                            {/* Navbar Transparent Submenu - Visual only */}
                            <li>
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <div className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center bg-gray-200/30 dark:bg-gray-700/30">
                                      <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </div>
                                    <Typography variant="small" className="text-xs font-medium truncate">
                                      Transparent
                                    </Typography>
                                  </div>
                                  <Switch
                                    id="navbar-transparent"
                                    value={true}
                                    onChange={() => {
                                      // Visual only - no functionality
                                    }}
                                  />
                                </div>
                              </motion.div>
                            </li>

                            {/* Navbar Size Submenu - Visual only */}
                            <li>
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <button
                                  onClick={() => {
                                    setOpenSections((current) => ({
                                      ...current,
                                      navbarSize: !current.navbarSize,
                                    }));
                                  }}
                                  className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200"
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center bg-gray-200/30 dark:bg-gray-700/30">
                                      <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                      </svg>
                                    </div>
                                    <Typography variant="small" className="text-xs font-medium truncate">
                                      Size
                                    </Typography>
                                  </div>
                                  <ChevronDownIcon
                                    className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${
                                      openSections.navbarSize ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>
                              </motion.div>
                              <AnimatePresence>
                                {openSections.navbarSize && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-1 ml-4 pl-3 py-2 space-y-2">
                                      {["Small", "Medium", "Large"].map((size) => (
                                        <motion.button
                                          key={size}
                                          whileHover={{ x: 2 }}
                                          whileTap={{ scale: 0.98 }}
                                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 bg-gray-100/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/30"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Visual only - no functionality
                                          }}
                                        >
                                          <div className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center bg-gray-200/50 dark:bg-gray-700/50">
                                            <div className="w-2.5 h-2.5 rounded bg-gray-400 dark:bg-gray-500"></div>
                                          </div>
                                          <Typography variant="small" className="font-semibold text-xs">
                                            {size}
                                          </Typography>
                                        </motion.button>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>

                  {/* Layout Section - Visual only */}
                  <li>
                    <motion.div
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <button
                        onClick={() => {
                          setOpenSections((current) => ({
                            ...current,
                            layout: !current.layout,
                          }));
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2 py-2.5 rounded-lg transition-all duration-200 group ${
                          openSections.layout
                            ? "bg-gray-100/50 dark:bg-gray-800/30 text-gray-900 dark:text-gray-100"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              openSections.layout
                                ? "bg-gray-200/50 dark:bg-gray-700/50"
                                : "bg-gray-200/50 dark:bg-gray-700/50 group-hover:bg-gray-300/50 dark:group-hover:bg-gray-600/50"
                            }`}
                          >
                            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                            </svg>
                          </div>
                          <Typography
                            variant="small"
                            className="font-semibold text-sm truncate"
                          >
                            Layout
                          </Typography>
                        </div>
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                            openSections.layout ? "rotate-180" : ""
                          } text-gray-500 dark:text-gray-400`}
                        />
                      </button>
                    </motion.div>

                    <AnimatePresence>
                      {openSections.layout && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-1 ml-3 pl-3 border-l-2 border-gray-200 dark:border-gray-700 space-y-0.5">
                            {/* Compact Mode - Visual only */}
                            <li>
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <div className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center bg-gray-200/30 dark:bg-gray-700/30">
                                      <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                      </svg>
                                    </div>
                                    <Typography variant="small" className="text-xs font-medium truncate">
                                      Compact Mode
                                    </Typography>
                                  </div>
                                  <Switch
                                    id="layout-compact"
                                    value={false}
                                    onChange={() => {
                                      // Visual only - no functionality
                                    }}
                                  />
                                </div>
                              </motion.div>
                            </li>

                            {/* RTL Mode - Visual only */}
                            <li>
                              <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <div className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center bg-gray-200/30 dark:bg-gray-700/30">
                                      <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                      </svg>
                                    </div>
                                    <Typography variant="small" className="text-xs font-medium truncate">
                                      RTL Mode
                                    </Typography>
                                  </div>
                                  <Switch
                                    id="layout-rtl"
                                    value={false}
                                    onChange={() => {
                                      // Visual only - no functionality
                                    }}
                                  />
                                </div>
                              </motion.div>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                </ul>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

Configurator.displayName = "/src/widgets/layout/configurator.jsx";

export default Configurator;
