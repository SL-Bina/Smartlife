import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useTranslation } from "react-i18next";
import { SidenavSubMenuItem } from "./SidenavSubMenuItem";

export function SidenavMenuItem({ page, layout, routes, openMenus, setOpenMenus }) {
  const location = useLocation();
  const [controller, dispatch] = useMaterialTailwindController();
  const { t } = useTranslation();
  const hasChildren = Array.isArray(page.children) && page.children.length > 0;

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
      <li>
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
            className={`w-full flex items-center justify-between gap-2 xl:gap-3 px-2 xl:px-3 py-2 xl:py-2.5 rounded-lg xl:rounded-xl transition-all duration-200 group ${
              isParentActive
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30"
                : isOpen
                ? "bg-gray-100/50 dark:bg-gray-800/30 text-gray-900 dark:text-gray-100"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
            }`}
          >
            <div className="flex items-center gap-2 xl:gap-3 min-w-0 flex-1">
              <div
                className={`flex-shrink-0 w-7 h-7 xl:w-8 xl:h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isParentActive
                    ? "bg-white/20"
                    : "bg-gray-200/50 dark:bg-gray-700/50 group-hover:bg-gray-300/50 dark:group-hover:bg-gray-600/50"
                }`}
              >
                {React.cloneElement(page.icon, {
                  className: `w-3.5 h-3.5 xl:w-4 xl:h-4 ${
                    isParentActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`,
                })}
              </div>
              <Typography
                variant="small"
                className={`font-semibold text-sm xl:text-base truncate ${
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
              className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200 flex-shrink-0 ${
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
              <ul className="mt-1 xl:mt-1.5 ml-3 xl:ml-4 pl-3 xl:pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-0.5">
                {page.children
                  .filter((child) => !child.hideInSidenav)
                  .map(({ icon, name, path }) => {
                    const isParentPath = page.children.some(
                      (otherChild) =>
                        otherChild.path !== path &&
                        otherChild.path.startsWith(path + "/")
                    );

                    return (
                      <SidenavSubMenuItem
                        key={name}
                        icon={icon}
                        name={name}
                        path={path}
                        layout={layout}
                        isParentPath={isParentPath}
                      />
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
    <li>
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
                className={`flex items-center gap-2 xl:gap-3 px-2 xl:px-3 py-2 xl:py-2.5 rounded-lg xl:rounded-xl transition-all duration-200 group ${
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
                  className={`flex-shrink-0 w-7 h-7 xl:w-8 xl:h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    shouldBeActive
                      ? "bg-white/20"
                      : "bg-gray-200/50 dark:bg-gray-700/50 group-hover:bg-gray-300/50 dark:group-hover:bg-gray-600/50"
                  }`}
                >
                  {React.cloneElement(page.icon, {
                    className: `w-3.5 h-3.5 xl:w-4 xl:h-4 ${
                      shouldBeActive
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`,
                  })}
                </div>
                <Typography
                  variant="small"
                  className={`font-semibold text-sm xl:text-base truncate ${
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
}

