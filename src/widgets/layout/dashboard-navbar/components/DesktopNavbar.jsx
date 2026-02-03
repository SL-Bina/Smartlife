import React from "react";
import { IconButton, Typography, Button } from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { NavbarBreadcrumbs } from "./NavbarBreadcrumbs";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";

export function DesktopNavbar({ pathParts, pageTitle, fixedNavbar }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;

  return (
    <div className="hidden md:flex items-center justify-between gap-2 lg:gap-4 w-full">
      {/* Left side */}
      <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
        <IconButton
          variant="text"
          color="blue-gray"
          className="grid xl:hidden dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 flex-shrink-0 rounded-xl transition-all"
          onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          size="sm"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
            <Bars3Icon strokeWidth={3} className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </div>
        </IconButton>
        <div className="min-w-0 flex-1">
          <NavbarBreadcrumbs pathParts={pathParts} fixedNavbar={fixedNavbar} />
          {/* <Typography variant="h6" className="text-gray-900 dark:text-white text-sm lg:text-base xl:text-lg font-bold truncate">
            {pageTitle}
          </Typography> */}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-end gap-1.5 lg:gap-2 flex-shrink-0">
        <DarkModeToggle />
        <LanguageSelector />
        <NotificationsMenu />
        <UserMenu showButton={true} />
      </div>
    </div>
  );
}

