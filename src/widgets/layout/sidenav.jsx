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
    // Aktiv child route dəyişəndə submenu-ləri vəziyyətə uyğunlaşdır
    setOpenMenus((current) => {
      const updated = {};

      routes.forEach(({ layout, pages }) => {
        pages.forEach((page) => {
          if (Array.isArray(page.children) && page.children.length > 0) {
            const hasActiveChild = page.children.some(
              (child) => `/${layout}${child.path}` === location.pathname
            );

            // Yalnız aktiv child route-u olan submenu-ni aç
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
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 dark:from-blue-900 dark:to-gray-900",
    white: "bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-red-600 shadow-sm flex flex-col overflow-hidden`}
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
      {/* Scrollable Menu List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden m-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500">
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

                return (
                  <li key={page.name}>
                    <Button
                      variant={isOpen ? "filled" : "text"}
                      color={
                        isOpen
                          ? sidenavColor === "dark"
                            ? "white"
                            : sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "gray"
                      }
                      className={`flex items-center justify-between gap-2 px-4 capitalize transition-colors ${
                        isOpen 
                          ? "dark:bg-gray-700 dark:text-white bg-gray-100" 
                          : "dark:text-white dark:hover:bg-gray-700/50 dark:bg-transparent hover:bg-gray-50"
                      }`}
                      fullWidth
                      onClick={(e) => {
                        // Bir submenu açılanda digərlərini bağla - yalnız bir submenu açıq olsun
                        setOpenMenus((current) => {
                          // Əgər bu menu açıqdırsa, onu bağla
                          if (current[page.name]) {
                            return {};
                          }
                          // Bu menu açıq deyilsə, onu aç və digərlərini bağla
                          return { [page.name]: true };
                        });
                      }}
                    >
                      <span className="flex items-center gap-4">
                        <motion.div
                          whileTap={{ scale: 0.8, rotate: 360 }}
                          whileHover={{ scale: 1.1, rotate: 15 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="dark:text-white"
                        >
                          {page.icon}
                        </motion.div>
                        <Typography
                          color="inherit"
                          className="font-medium dark:text-white"
                        >
                          {page.name.startsWith("sidebar.")
                            ? t(page.name)
                            : page.name}
                        </Typography>
                      </span>
                      <ChevronDownIcon
                        strokeWidth={2}
                        className={`h-4 w-4 transition-transform dark:text-white ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="mt-1 flex flex-col gap-1 pl-5 dark:bg-transparent">
                        {page.children
                          .filter((child) => !child.hideInSidenav)
                          .map(({ icon, name, path }) => (
                          <li key={name}>
                            <NavLink to={`/${layout}${path}`}>
                              {({ isActive }) => (
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
                                  className={`flex items-center justify-start gap-3 px-3 py-2 text-sm normal-case transition-colors text-left ${
                                    isActive 
                                      ? "dark:bg-gray-700 dark:text-white bg-gray-100" 
                                      : "dark:text-white dark:hover:bg-gray-700/50 dark:bg-transparent hover:bg-gray-50"
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
                                    whileHover={{ scale: 1.1, rotate: 15 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="dark:text-white"
                                  >
                                    {icon}
                                  </motion.div>
                                  <Typography
                                    color="inherit"
                                    className="font-medium dark:text-white text-left"
                                  >
                                    {name.startsWith("sidebar.")
                                      ? t(name)
                                      : name}
                                  </Typography>
                                </Button>
                              )}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li key={page.name}>
                  <NavLink to={`/${layout}${page.path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={
                          isActive
                            ? sidenavColor === "dark" ? "gray" : sidenavColor
                            : sidenavType === "dark"
                            ? "white"
                            : "gray"
                        }
                        className={`flex items-center gap-4 px-4 capitalize transition-colors ${
                          isActive 
                            ? "dark:bg-gray-700 dark:text-white bg-gray-100" 
                            : "dark:text-white dark:hover:bg-gray-700/50 dark:bg-transparent hover:bg-gray-50"
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
                          whileHover={{ scale: 1.1, rotate: 15 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="dark:text-white"
                        >
                          {page.icon}
                        </motion.div>
                        <Typography
                          color="inherit"
                          className="font-medium dark:text-white"
                        >
                          {page.name.startsWith("sidebar.")
                            ? t(page.name)
                            : page.name}
                        </Typography>
                      </Button>
                    )}
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
  brandName: "West",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
