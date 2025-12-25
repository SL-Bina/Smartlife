import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@material-tailwind/react";
import { useMaterialTailwindController } from "@/context";
import { useTranslation } from "react-i18next";
import { pageTitleKeyMap } from "./utils/pageTitleMap";
import { MobileNavbar } from "./components/MobileNavbar";
import { DesktopNavbar } from "./components/DesktopNavbar";

export function DashboardNavbar() {
  const [controller] = useMaterialTailwindController();
  const { fixedNavbar } = controller;
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const pathParts = pathname.split("/").filter((el) => el !== "");
  const page = pathParts.slice(1).join("/") || pathParts[0] || "";
  const fullPath = pathParts.slice(1).join("/");

  const pageTitle = pageTitleKeyMap[fullPath]
    ? t(pageTitleKeyMap[fullPath])
    : pageTitleKeyMap[page]
      ? t(pageTitleKeyMap[page])
      : page;

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-none sm:rounded-2xl transition-all duration-300 backdrop-blur-xl bg-gradient-to-br from-white/95 via-white/80 to-white/95 dark:from-gray-900/95 dark:via-gray-800/80 dark:to-gray-900/95 border-0 sm:border border-gray-200/50 dark:border-gray-700/50 ${fixedNavbar
        ? "sticky top-0 sm:top-4 z-40 py-3 sm:py-4 shadow-lg sm:shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50"
        : "px-3 sm:px-4 lg:px-6 py-3 sm:py-4"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <MobileNavbar pageTitle={pageTitle} />
      <DesktopNavbar pathParts={pathParts} pageTitle={pageTitle} fixedNavbar={fixedNavbar} />
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar/index.jsx";

export default DashboardNavbar;

