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

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const { t } = useTranslation();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});

  React.useEffect(() => {
    // Aktiv child route dəyişəndə submenu-ləri vəziyyətə uyğunlaşdır
    setOpenMenus((current) => {
      const updated = { ...current };

      routes.forEach(({ layout, pages }) => {
        pages.forEach((page) => {
          if (Array.isArray(page.children) && page.children.length > 0) {
            const hasActiveChild = page.children.some(
              (child) => `/${layout}${child.path}` === location.pathname
            );

            // Əgər heç bir child aktiv deyilsə, bu parent submenu-ni bağla
            if (!hasActiveChild) {
              updated[page.name] = false;
            }
          }
        });
      });

      return updated;
    });
  }, [location.pathname, routes]);

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-red-600 shadow-sm`}
    >
      <div
        className={`relative`}
      >
        <Link to="/" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "black"}
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
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "black"}
                  className="font-black uppercase opacity-75"
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
                      className="flex items-center justify-between gap-2 px-4 capitalize"
                      fullWidth
                      onClick={() =>
                        setOpenMenus((current) => ({
                          ...current,
                          [page.name]: !current[page.name],
                        }))
                      }
                    >
                      <span className="flex items-center gap-4">
                        {page.icon}
                        <Typography
                          color="inherit"
                          className="font-medium"
                        >
                          {page.name.startsWith("sidebar.")
                            ? t(page.name)
                            : page.name}
                        </Typography>
                      </span>
                      <ChevronDownIcon
                        strokeWidth={2}
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="mt-1 flex flex-col gap-1 pl-5">
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
                                  className="flex items-center gap-3 px-3 py-2 text-sm normal-case"
                                  fullWidth
                                  onClick={() => {
                                    // mobil görünüşdə route dəyişəndə sidenav bağlansın
                                    if (window.innerWidth < 1280) {
                                      setOpenSidenav(dispatch, false);
                                    }
                                  }}
                                >
                                  {icon}
                                  <Typography
                                    color="inherit"
                                    className="font-medium"
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
                        className="flex items-center gap-4 px-4 capitalize"
                        fullWidth
                        onClick={() => {
                          // mobil görünüşdə route dəyişəndə sidenav bağlansın
                          if (window.innerWidth < 1280) {
                            setOpenSidenav(dispatch, false);
                          }
                        }}
                      >
                        {page.icon}
                        <Typography
                          color="inherit"
                          className="font-medium"
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
