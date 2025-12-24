import React from "react";
import { useLocation, Link, NavLink } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
  setDarkMode,
} from "@/context";
import { Switch } from "@material-tailwind/react";
import { useAuth } from "@/auth-context";
import { useTranslation } from "react-i18next";

import ReactCountryFlag from "react-country-flag";

const languages = [
  {
    code: "az",
    label: "Azərbaycan dili",
    flag: <ReactCountryFlag countryCode="AZ" svg style={{ width: "1.5em", height: "1.5em" }} />
  },
  {
    code: "en",
    label: "English",
    flag: <ReactCountryFlag countryCode="GB" svg style={{ width: "1.5em", height: "1.5em" }} />
  },
  {
    code: "ru",
    label: "Русский",
    flag: <ReactCountryFlag countryCode="RU" svg style={{ width: "1.5em", height: "1.5em" }} />
  },
];


const layoutTitleKeyMap = {
  dashboard: "sidebar.dashboard",
};

const pageTitleKeyMap = {
  home: "sidebar.dashboard",
  finance: "sidebar.finance",
  invoices: "sidebar.invoices",
  "payment-history": "sidebar.paymentHistory",
  reports: "sidebar.reports",
  "debtor-apartments": "sidebar.debtorApartments",
  expenses: "sidebar.expenses",
  deposit: "sidebar.deposit",
  transfers: "sidebar.transfers",
  debt: "sidebar.debt",
  notifications: "sidebar.notifications",
  "user-rights": "sidebar.userRights",
  "user-permissions": "sidebar.userPermissions",
  profile: "sidebar.profile",
  mtk: "sidebar.mtk",
  complex: "sidebar.complexes",
  buildings: "sidebar.buildings",
  properties: "sidebar.properties",
  residents: "sidebar.residents",
  devices: "sidebar.devices",
  resident: "sidebar.resident",
  blocks: "sidebar.blocks",
  "apartment-groups": "apartmentGroups.pageTitle",
  "building-service-fee": "buildingServiceFee.pageTitle",
  "service-fee": "serviceFee.pageTitle",
  kpi: "kpi.pageTitle",
  applications: "applications.list.pageTitle",
  "applications/list": "applications.list.pageTitle",
  "applications/evaluation": "applications.evaluation.pageTitle",
  "complex-dashboard": "sidebar.complexDashboard",
  "notifications/send": "sidebar.sendNotification",
  "notifications/archive": "sidebar.notificationArchive",
  "notifications/sent-sms": "sidebar.sentSMS",
  "queries/create": "sidebar.createQuery",
  "queries": "sidebar.queries",
  "services": "sidebar.services",
  "electronic-documents": "sidebar.electronicDocuments",
  "reception": "sidebar.reception",
  "finance/invoices": "sidebar.invoices",
  "finance/payment-history": "sidebar.paymentHistory",
  "finance/reports": "sidebar.reports",
  "finance/debtor-apartments": "sidebar.debtorApartments",
  "finance/expenses": "sidebar.expenses",
  "finance/deposit": "sidebar.deposit",
  "finance/transfers": "sidebar.transfers",
  "finance/debt": "sidebar.debt",
  "management": "sidebar.buildingManagement",
  "management/mtk": "sidebar.mtk",
  "management/complex": "sidebar.complexes",
  "management/buildings": "sidebar.buildings",
  "management/blocks": "sidebar.blocks",
  "management/properties": "sidebar.properties",
  "management/residents": "sidebar.residents",
  "management/apartment-groups": "apartmentGroups.pageTitle",
  "management/service-fee": "serviceFee.pageTitle",
  "management/building-service-fee": "buildingServiceFee.pageTitle",
  "resident/home": "residentDashboard.pageTitle",
  "resident/invoices": "sidebar.invoices",
  "resident/applications": "sidebar.applicationsList",
  "resident/notifications": "sidebar.notifications",
  "resident/profile": "sidebar.profile",
  "settings": "header.settings",
};

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav, darkMode } = controller;
  const { pathname } = useLocation();
  const pathParts = pathname.split("/").filter((el) => el !== "");
  const layout = pathParts[0] || "";
  const page = pathParts.slice(1).join("/") || pathParts[0] || "";
  const { user, logout, isInitialized } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const layoutTitle = layoutTitleKeyMap[layout]
    ? t(layoutTitleKeyMap[layout])
    : layout;

  const fullPath = pathParts.slice(1).join("/");
  const pageTitle = pageTitleKeyMap[fullPath]
    ? t(pageTitleKeyMap[fullPath])
    : pageTitleKeyMap[page]
      ? t(pageTitleKeyMap[page])
      : page;

  const translatePathSegment = (segment) => {
    if (pageTitleKeyMap[segment]) {
      return t(pageTitleKeyMap[segment]);
    }
    // Special handling for "management" segment
    if (segment === "management") {
      return t("sidebar.buildingManagement");
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  const breadcrumbItems = [];
  if (pathParts.length > 1) {
    breadcrumbItems.push({
      label: layoutTitle,
      path: `/${layout}`,
    });

    let currentPath = "";
    for (let i = 1; i < pathParts.length; i++) {
      currentPath += (currentPath ? "/" : "") + pathParts[i];
      const segment = pathParts[i];
      const isLast = i === pathParts.length - 1;

      let translatedLabel;
      if (isLast && pageTitleKeyMap[currentPath]) {
        translatedLabel = t(pageTitleKeyMap[currentPath]);
      } else if (pageTitleKeyMap[segment]) {
        translatedLabel = t(pageTitleKeyMap[segment]);
      } else {
        translatedLabel = translatePathSegment(segment);
      }

      breadcrumbItems.push({
        label: translatedLabel,
        path: `/${layout}/${currentPath}`,
        isLast: isLast,
      });
    }
  } else {
    breadcrumbItems.push({
      label: layoutTitle,
      path: `/${layout}`,
      isLast: true,
    });
  }

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all dark:bg-gray-900 border border-red-600 dark:border-gray-700 ${fixedNavbar
        ? "sticky top-4 z-40 py-3 shadow-lg shadow-blue-gray-500/5"
        : "px-4 sm:px-6 py-2 sm:py-3"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side - Mobile: only hamburger, Desktop: hamburger + title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden dark:text-gray-300 dark:hover:bg-gray-800 flex-shrink-0"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
            size="sm"
          >
            <Bars3Icon strokeWidth={3} className="h-5 w-5" />
          </IconButton>
          <div className="min-w-0 flex-1 hidden sm:block">
            <Breadcrumbs
              className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""
                }`}
            >
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  {item.isLast ? (
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal dark:text-gray-300 text-xs sm:text-sm truncate"
                    >
                      {item.label}
                    </Typography>
                  ) : (
                    <Link to={item.path}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100 dark:text-gray-300 text-xs sm:text-sm truncate"
                      >
                        {item.label}
                      </Typography>
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </Breadcrumbs>
            <Typography
              variant="h6"
              color="blue-gray"
              className="dark:text-white text-sm sm:text-base lg:text-lg font-bold truncate"
            >
              {pageTitle}
            </Typography>
          </div>
        </div>
        {/* Right side - Icons */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 flex-shrink-0">
          {/* Dark Mode Toggle - Button Style */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton
                variant="text"
                color="blue-gray"
                className="dark:text-gray-300 dark:hover:bg-gray-800"
                title={darkMode ? t("header.lightMode") : t("header.darkMode")}
                size="sm"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-blue-gray-700 dark:text-gray-300" />
                )}
              </IconButton>
            </MenuHandler>
            <MenuList className="dark:bg-gray-800 dark:border-gray-700 min-w-[140px]">
              <MenuItem
                onClick={() => setDarkMode(dispatch, false)}
                className={`dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 ${!darkMode ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
              >
                <SunIcon className="h-4 w-4 text-yellow-500" />
                <span>{t("header.lightMode")}</span>
              </MenuItem>
              <MenuItem
                onClick={() => setDarkMode(dispatch, true)}
                className={`dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 ${darkMode ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
              >
                <MoonIcon className="h-4 w-4 text-blue-gray-700 dark:text-gray-300" />
                <span>{t("header.darkMode")}</span>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* Language selector */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton
                variant="text"
                color="blue-gray"
                className="dark:text-gray-300 dark:hover:bg-gray-700 p-1"
                size="sm"
              >
                {languages.map((lng) => (
                  lng.code === i18n.language && (
                    <span key={lng.code} className="text-lg">
                      {lng.flag}
                    </span>
                  )
                ))}
              </IconButton>
            </MenuHandler>
            <MenuList className="min-w-[160px] dark:bg-gray-800 dark:border-gray-700">
              {languages.map((lng) => (
                <MenuItem
                  key={lng.code}
                  onClick={() => changeLanguage(lng.code)}
                  className={`dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 ${i18n.language === lng.code ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                >
                  <span className="text-base">{lng.flag}</span>
                  <span>{lng.label}</span>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Notifications */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton
                variant="text"
                color="blue-gray"
                className="dark:text-gray-300 dark:hover:bg-gray-700 relative p-1"
                size="sm"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
              </IconButton>
            </MenuHandler>
            <MenuList className="w-80 sm:w-96 border-0 dark:bg-gray-800 dark:border-gray-700 max-h-[400px] overflow-y-auto">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-semibold">
                  {t("header.notifications")}
                </Typography>
              </div>
              <MenuItem className="flex items-center gap-3 dark:hover:bg-gray-800">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal dark:text-gray-300"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60 dark:text-gray-400"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4 dark:hover:bg-gray-700">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal dark:text-gray-300"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60 dark:text-gray-400"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4 dark:hover:bg-gray-700">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900 dark:from-blue-900 dark:to-gray-800">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal dark:text-gray-300"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60 dark:text-gray-400"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* User info / auth */}
          {!isInitialized ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            </div>
          ) : user ? (
            <>
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Button
                    variant="text"
                    color="blue-gray"
                    className="hidden items-center gap-2 px-3 sm:px-4 xl:flex normal-case dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Avatar
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=random&color=fff&size=128`}
                      alt={user.fullName}
                      size="sm"
                      variant="circular"
                    />
                    <span className="text-sm sm:text-base">{user.fullName}</span>
                  </Button>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-700 min-w-[180px]">
                  <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2">
                    <NavLink
                      to="/dashboard/profile"
                      className="flex items-center gap-2"
                    >
                      <UserCircleIcon className="h-4 w-4" />
                      <span>{t("header.profile")}</span>
                    </NavLink>
                  </MenuItem>
                  <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2">
                    <NavLink
                      to="/dashboard/settings"
                      className="flex items-center gap-2"
                    >
                      <Cog6ToothIcon className="h-4 w-4" />
                      <span>{t("header.settings")}</span>
                    </NavLink>
                  </MenuItem>
                  <MenuItem onClick={logout} className="dark:hover:bg-gray-800 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <span>{t("common.logout")}</span>
                  </MenuItem>
                </MenuList>
              </Menu>
              <Menu placement="bottom-end">
                <MenuHandler>
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    className="grid xl:hidden dark:text-gray-300 dark:hover:bg-gray-700 p-1"
                    size="sm"
                  >
                    <Avatar
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=random&color=fff&size=128`}
                      alt={user.fullName}
                      size="sm"
                      variant="circular"
                    />
                  </IconButton>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-700 min-w-[180px]">
                  <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2">
                    <NavLink
                      to="/dashboard/profile"
                      className="flex items-center gap-2"
                    >
                      <UserCircleIcon className="h-4 w-4" />
                      <span>{t("header.profile")}</span>
                    </NavLink>
                  </MenuItem>
                  <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2">
                    <NavLink
                      to="/dashboard/settings"
                      className="flex items-center gap-2"
                    >
                      <Cog6ToothIcon className="h-4 w-4" />
                      <span>{t("header.settings")}</span>
                    </NavLink>
                  </MenuItem>
                  <MenuItem onClick={logout} className="dark:hover:bg-gray-800 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <span>{t("common.logout")}</span>
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Link to="/auth/sign-in">
              <Button
                variant="text"
                color="blue-gray"
                className="hidden items-center gap-1 px-3 sm:px-4 xl:flex normal-case dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span className="text-sm sm:text-base">{t("common.login")}</span>
              </Button>
              <IconButton
                variant="text"
                color="blue-gray"
                className="grid xl:hidden dark:text-gray-300 dark:hover:bg-gray-700 p-1"
                size="sm"
              >
                <UserCircleIcon className="h-5 w-5" />
              </IconButton>
            </Link>
          )}
          {/* <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton> */}
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
