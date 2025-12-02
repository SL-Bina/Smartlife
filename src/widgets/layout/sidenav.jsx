import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useLocation } from "react-router-dom";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const { t } = useTranslation();
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
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-900",
    white: "bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-red-600 dark:border-gray-700 shadow-sm flex flex-col`}
    >
      {/* Fixed Header */}
      <div className="relative flex-shrink-0">
        <Link to="/" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "black"}
            className="dark:text-white"
          >
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color={sidenavType === "dark" ? "white" : "blue-gray"}
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden p-5"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon
            strokeWidth={2.5}
            className={` h-5 w-5 ${sidenavType === "dark" ? "text-white" : "text-blue-gray-700"}`}
          />
        </IconButton>
      </div>
      {/* Menu List */}
      <div className="flex-1 m-4 overflow-y-auto overflow-x-hidden custom-sidenav-scrollbar">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "black"}
                  className="font-black uppercase opacity-75 dark:text-white dark:opacity-100"
                >
                  {title}
                </Typography>
              </li>
            )}
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
                // Parent button yalnız öz path-inə görə aktiv olmalıdır, child route-lara görə deyil
                // Parent aktiv olsun yalnız o zaman ki, öz path-i aktivdir VƏ heç bir child aktiv deyil
                const isParentActive = page.path && 
                  `/${layout}${page.path}` === location.pathname && 
                  !hasActiveChild;

                return (
                  <li key={page.name}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Button
                        variant={isParentActive ? "gradient" : "text"}
                        color={
                          isParentActive
                            ? sidenavColor === "dark" ? "gray" : sidenavColor
                            : sidenavType === "dark"
                            ? "white"
                            : "gray"
                        }
                          className={`flex items-center justify-between gap-2 px-4 capitalize transition-colors min-w-0 ${
                          isParentActive 
                            ? "dark:bg-gray-800 dark:text-white bg-gray-100" 
                            : isOpen
                            ? "dark:text-white dark:hover:bg-gray-800/50 dark:bg-transparent hover:bg-gray-50"
                            : "dark:text-white dark:hover:bg-gray-800/50 dark:bg-transparent hover:bg-gray-50"
                        }`}
                        fullWidth
                        onClick={(e) => {
                          setOpenMenus((current) => {
                            if (current[page.name]) {
                              return {};
                            }
                            return { [page.name]: true };
                          });
                        }}
                      >
                        <span className="flex items-center gap-4 min-w-0 flex-1">
                          <motion.div
                            whileTap={{ scale: 0.8, rotate: 360 }}
                            className="dark:text-white group-hover:scale-110 group-hover:rotate-12 transition-transform flex-shrink-0"
                          >
                            {page.icon}
                          </motion.div>
                          <Typography
                            color="inherit"
                            className="font-medium dark:text-white whitespace-nowrap overflow-hidden text-ellipsis text-left"
                          >
                            {page.name.startsWith("sidebar.")
                              ? t(page.name)
                              : page.name}
                          </Typography>
                        </span>
                        <ChevronDownIcon
                          strokeWidth={2}
                          className={`h-4 w-4 transition-transform dark:text-white flex-shrink-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </motion.div>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="mt-1 flex flex-col gap-1 pl-5 dark:bg-transparent">
                        {page.children
                          .filter((child) => !child.hideInSidenav)
                          .map(({ icon, name, path }) => {
                            // Əgər path başqa bir path-in prefix-idirsə, end={true} istifadə edirik
                            // Bu, yalnız tam uyğun gələndə aktiv olmasını təmin edir
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
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                  <Button
                                    variant={isActive ? "gradient" : "text"}
                                    color={
                                      isActive
                                        ? sidenavColor === "dark"
                                          ? "gray"
                                          : sidenavColor
                                        : sidenavType === "dark"
                                        ? "white"
                                        : "gray"
                                    }
                                    className={`group flex items-center justify-start gap-3 px-3 py-2 text-sm normal-case transition-colors text-left min-w-0 ${
                                      isActive 
                                        ? "dark:bg-gray-800 dark:text-white bg-gray-100" 
                                        : "dark:text-white dark:hover:bg-gray-800/50 dark:bg-transparent hover:bg-gray-50"
                                    }`}
                                    fullWidth
                                    onClick={(e) => {
                                      if (window.innerWidth < 1280) {
                                        setOpenSidenav(dispatch, false);
                                      }
                                    }}
                                  >
                                  <motion.div
                                    whileTap={{ scale: 0.8, rotate: 360 }}
                                    className="dark:text-white group-hover:scale-110 group-hover:rotate-12 transition-transform flex-shrink-0"
                                  >
                                    {icon}
                                  </motion.div>
                                  <Typography
                                    color="inherit"
                                    className="font-medium dark:text-white text-left whitespace-nowrap overflow-hidden text-ellipsis min-w-0 flex-1"
                                  >
                                    {name.startsWith("sidebar.")
                                      ? t(name)
                                      : name}
                                  </Typography>
                                  </Button>
                                </motion.div>
                              )}
                            </NavLink>
                          </li>
                            );
                          })}
                      </ul>
                    </div>
                  </li>
                );
              }

              // Standalone route-lar üçün: yalnız tam path uyğun olduqda aktiv olsun
              // Child route-lar aktiv olduqda aktiv görünməsin
              const currentPath = `/${layout}${page.path}`;
              // Bütün route-larda child route-ları yoxlayırıq
              const hasAnyChildRouteActive = routes.some(({ layout: routeLayout, pages: routePages }) =>
                routePages.some((routePage) => {
                  if (Array.isArray(routePage.children) && routePage.children.length > 0) {
                    return routePage.children.some(
                      (child) => {
                        const childPath = `/${routeLayout}${child.path}`;
                        return childPath === location.pathname && childPath.startsWith(currentPath + "/");
                      }
                    );
                  }
                  return false;
                })
              );
              // Yalnız tam path uyğun olduqda və heç bir child route aktiv olmadıqda aktiv olsun
              const isStandaloneActive = currentPath === location.pathname && !hasAnyChildRouteActive;

              return (
                <li key={page.name}>
                  <NavLink to={currentPath} end={true}>
                    {({ isActive }) => {
                      // NavLink-in isActive-i ilə bizim məntiqimizi birləşdiririk
                      const shouldBeActive = isStandaloneActive;
                      
                      return (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Button
                            variant={shouldBeActive ? "gradient" : "text"}
                            color={
                              shouldBeActive
                                ? sidenavColor === "dark" ? "gray" : sidenavColor
                                : sidenavType === "dark"
                                ? "white"
                                : "gray"
                            }
                            className={`group flex items-center gap-4 px-4 capitalize transition-colors min-w-0 ${
                              shouldBeActive 
                                ? "dark:bg-gray-800 dark:text-white bg-gray-100" 
                                : "dark:text-white dark:hover:bg-gray-800/50 dark:bg-transparent hover:bg-gray-50"
                            }`}
                            fullWidth
                            onClick={(e) => {
                              // Icon animasiyasını trigger et - icon-un öz click event-i işləyəcək
                              // mobil görünüşdə route dəyişəndə sidenav bağlansın
                              if (window.innerWidth < 1280) {
                                setOpenSidenav(dispatch, false);
                              }
                            }}
                          >
                            <motion.div
                              whileTap={{ scale: 0.8, rotate: 360 }}
                              className="dark:text-white group-hover:scale-110 group-hover:rotate-12 transition-transform flex-shrink-0"
                            >
                              {page.icon}
                            </motion.div>
                            <Typography
                              color="inherit"
                              className="font-medium dark:text-white whitespace-nowrap overflow-hidden text-ellipsis min-w-0 flex-1 text-left"
                            >
                              {page.name.startsWith("sidebar.")
                                ? t(page.name)
                                : page.name}
                            </Typography>
                          </Button>
                        </motion.div>
                      );
                    }}
                  </NavLink>
                </li>
              );
            })}
        </ul>
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

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
