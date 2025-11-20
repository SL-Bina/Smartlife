import { useLocation, Link } from "react-router-dom";
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
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  // setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
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
  notifications: "sidebar.notifications",
  profile: "sidebar.profile",
  mtk: "sidebar.mtk",
  complex: "sidebar.complexes",
  buildings: "sidebar.buildings",
  properties: "sidebar.properties",
  residents: "sidebar.residents",
  blocks: "sidebar.blocks",
  "apartment-groups": "apartmentGroups.pageTitle",
  "building-service-fee": "buildingServiceFee.pageTitle",
  "service-fee": "Servis haqqı",
};

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const layoutTitle = layoutTitleKeyMap[layout]
    ? t(layoutTitleKeyMap[layout])
    : layout;

  const pageTitle = pageTitleKeyMap[page]
    ? t(pageTitleKeyMap[page])
    : page;

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div>
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layoutTitle}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {pageTitle}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {pageTitle}
          </Typography>
        </div>
        <div className="flex items-center justify-end">
          {/* <div className="mr-auto md:mr-4 md:w-56">
            <Input label={t("header.search")} />
          </div> */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {/* Language selector */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <Button variant="text" className="flex items-center gap-1 px-2 normal-case">
                {languages.map((lng) => (
                  lng.code === i18n.language && (
                    <span key={lng.code} className="flex items-center gap-1">
                      <span>{lng.flag}</span>
                      <span className="hidden sm:inline-block text-xs font-medium">{lng.label}</span>
                    </span>
                  )
                ))}
              </Button>
            </MenuHandler>
            <MenuList className="min-w-[120px]">
              {languages.map((lng) => (
                <MenuItem key={lng.code} onClick={() => changeLanguage(lng.code)}>
                  <span className="mr-2">{lng.flag}</span>
                  <span>{lng.label}</span>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* User info / auth */}
          {user ? (
            <Menu placement="bottom-end">
              <MenuHandler>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="hidden items-center gap-2 px-4 xl:flex normal-case"
                >
                  <Avatar
                    src="https://ui-avatars.com/api/?name="
                    alt={user.fullName}
                    size="sm"
                  />
                  <span>{user.fullName}</span>
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={logout}>{t("common.logout")}</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to="/auth/sign-in">
              <Button
                variant="text"
                color="blue-gray"
                className="hidden items-center gap-1 px-4 xl:flex normal-case"
              >
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                {t("common.login")}
              </Button>
              <IconButton
                variant="text"
                color="blue-gray"
                className="grid xl:hidden"
              >
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </Link>
          )}

          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
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
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
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
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
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
