import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useLocation } from "react-router-dom";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/auth-context";
import { motion, AnimatePresence } from "framer-motion";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});

  React.useEffect(() => {
    setOpenMenus((current) => {
      const updated = {};

      routes.forEach(({ layout, pages }) => {
        pages.forEach((page) => {
          if (Array.isArray(page.children) && page.children.length > 0) {
            const hasActiveChild = page.children.some(
              (child) => `/${layout}${child.path}` === location.pathname
            );

            if (hasActiveChild) {
              updated[page.name] = true;
            }
          }
        });
      });

      return updated;
    });
  }, [location.pathname, routes]);

  const sidenavTypes = {
    dark: "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900",
    white: "bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-80 transition-all duration-300 ease-in-out xl:translate-x-0 flex flex-col backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl`}
    >
      {/* Elegant Header */}
      <div className="relative flex-shrink-0 px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-red-600/5 via-red-500/3 to-transparent dark:from-red-600/10 dark:via-red-500/5 dark:to-transparent">
        <Link to="/" className="flex flex-col items-center gap-3 group relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 group-hover:shadow-2xl group-hover:shadow-gray-300/50 dark:group-hover:shadow-gray-800/50 transition-all duration-300 relative overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
              <img 
                src="/img/logo-jira.svg" 
                alt="Logo" 
                className="w-14 h-14 object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-700/30 dark:to-transparent"></div>
            </div>
          </motion.div>
          <div className="flex flex-col items-center gap-1">
            <Typography
              variant="h5"
              className="font-bold text-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent"
            >
              {brandName}
            </Typography>
            <div className="flex flex-col items-center gap-1">
              <Typography
                variant="small"
                className="text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                {t("sidebar.welcome") || "Xoş gəldin"}
              </Typography>
              {user?.username && (
                <Typography
                  variant="small"
                  className="text-sm font-semibold text-gray-900 dark:text-white"
                >
                  {user.username}
                </Typography>
              )}
            </div>
          </div>
        </Link>
        <IconButton
          variant="text"
          size="sm"
          ripple={false}
          className="absolute right-4 top-4 xl:hidden !p-2.5 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all duration-200 hover:scale-110"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </IconButton>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 custom-sidenav-scrollbar">
        {routes.map(({ layout, title, pages }, key) => (
          <div key={key} className="mb-6">
            {title && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-3 mb-3"
              >
                <Typography
                  variant="small"
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500"
                >
                  {title}
                </Typography>
              </motion.div>
            )}
            <ul className="space-y-1">
              {pages
                .filter((page) => !page.hideInSidenav)
                .map((page) => {
                  const hasChildren =
                    Array.isArray(page.children) && page.children.length > 0;

                  if (hasChildren) {
                    const hasActiveChild = page.children.some(
                      ({ path }) => `/${layout}${path}` === location.pathname
                    );
                    const isOpen = hasActiveChild || !!openMenus[page.name];
                    const isParentActive =
                      page.path &&
                      `/${layout}${page.path}` === location.pathname &&
                      !hasActiveChild;

                    return (
                      <li key={page.name}>
                        <motion.div
                          whileHover={{ x: 2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <button
                            onClick={() => {
                              setOpenMenus((current) => {
                                if (current[page.name]) {
                                  return {};
                                }
                                return { [page.name]: true };
                              });
                            }}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                              isParentActive
                                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30"
                                : isOpen
                                ? "bg-gray-100/50 dark:bg-gray-800/30 text-gray-900 dark:text-gray-100"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div
                                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                  isParentActive
                                    ? "bg-white/20"
                                    : "bg-gray-200/50 dark:bg-gray-700/50 group-hover:bg-gray-300/50 dark:group-hover:bg-gray-600/50"
                                }`}
                              >
                                {React.cloneElement(page.icon, {
                                  className: `w-4 h-4 ${
                                    isParentActive
                                      ? "text-white"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`,
                                })}
                              </div>
                              <Typography
                                variant="small"
                                className={`font-semibold text-sm truncate ${
                                  isParentActive
                                    ? "text-white"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {page.name.startsWith("sidebar.")
                                  ? t(page.name)
                                  : page.name}
                              </Typography>
                            </div>
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                                isOpen ? "rotate-180" : ""
                              } ${
                                isParentActive
                                  ? "text-white"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                          </button>
                        </motion.div>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <ul className="mt-1.5 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-0.5">
                                {page.children
                                  .filter((child) => !child.hideInSidenav)
                                  .map(({ icon, name, path }) => {
                                    const isParentPath = page.children.some(
                                      (otherChild) =>
                                        otherChild.path !== path &&
                                        otherChild.path.startsWith(path + "/")
                                    );

                                    return (
                                      <li key={name}>
                                        <NavLink
                                          to={`/${layout}${path}`}
                                          end={isParentPath}
                                        >
                                          {({ isActive }) => (
                                            <motion.div
                                              whileHover={{ x: 4 }}
                                              transition={{
                                                type: "spring",
                                                stiffness: 400,
                                              }}
                                            >
                                              <div
                                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                                                  isActive
                                                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-500/20"
                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200"
                                                }`}
                                                onClick={() => {
                                                  if (window.innerWidth < 1280) {
                                                    setOpenSidenav(dispatch, false);
                                                  }
                                                }}
                                              >
                                                <div
                                                  className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${
                                                    isActive
                                                      ? "bg-white/20"
                                                      : "bg-gray-200/30 dark:bg-gray-700/30"
                                                  }`}
                                                >
                                                  {React.cloneElement(icon, {
                                                    className: `w-3.5 h-3.5 ${
                                                      isActive
                                                        ? "text-white"
                                                        : "text-gray-500 dark:text-gray-400"
                                                    }`,
                                                  })}
                                                </div>
                                                <Typography
                                                  variant="small"
                                                  className={`text-xs font-medium truncate ${
                                                    isActive
                                                      ? "text-white"
                                                      : "text-gray-600 dark:text-gray-400"
                                                  }`}
                                                >
                                                  {name.startsWith("sidebar.")
                                                    ? t(name)
                                                    : name}
                                                </Typography>
                                              </div>
                                            </motion.div>
                                          )}
                                        </NavLink>
                                      </li>
                                    );
                                  })}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  }

                  const currentPath = `/${layout}${page.path}`;
                  const hasAnyChildRouteActive = routes.some(
                    ({ layout: routeLayout, pages: routePages }) =>
                      routePages.some((routePage) => {
                        if (
                          Array.isArray(routePage.children) &&
                          routePage.children.length > 0
                        ) {
                          return routePage.children.some((child) => {
                            const childPath = `/${routeLayout}${child.path}`;
                            return (
                              childPath === location.pathname &&
                              childPath.startsWith(currentPath + "/")
                            );
                          });
                        }
                        return false;
                      })
                  );
                  const isStandaloneActive =
                    currentPath === location.pathname &&
                    !hasAnyChildRouteActive;

                  return (
                    <li key={page.name}>
                      <NavLink to={currentPath} end={true}>
                        {({ isActive }) => {
                          const shouldBeActive = isStandaloneActive;

                          return (
                            <motion.div
                              whileHover={{ x: 2 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                              }}
                            >
                              <div
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                                  shouldBeActive
                                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
                                }`}
                                onClick={() => {
                                  if (window.innerWidth < 1280) {
                                    setOpenSidenav(dispatch, false);
                                  }
                                }}
                              >
                                <div
                                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                    shouldBeActive
                                      ? "bg-white/20"
                                      : "bg-gray-200/50 dark:bg-gray-700/50 group-hover:bg-gray-300/50 dark:group-hover:bg-gray-600/50"
                                  }`}
                                >
                                  {React.cloneElement(page.icon, {
                                    className: `w-4 h-4 ${
                                      shouldBeActive
                                        ? "text-white"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`,
                                  })}
                                </div>
                                <Typography
                                  variant="small"
                                  className={`font-semibold text-sm truncate ${
                                    shouldBeActive
                                      ? "text-white"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {page.name.startsWith("sidebar.")
                                    ? t(page.name)
                                    : page.name}
                                </Typography>
                              </div>
                            </motion.div>
                          );
                        }}
                      </NavLink>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
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

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;
