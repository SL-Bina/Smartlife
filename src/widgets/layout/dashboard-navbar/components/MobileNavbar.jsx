import React from "react";
import { IconButton, Typography } from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";

export function MobileNavbar({ pageTitle }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;

  return (
    <div className="flex md:hidden items-center justify-between w-full gap-3">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <IconButton
          variant="text"
          color="blue-gray"
          className="dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0 rounded-full transition-all p-2"
          onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          size="sm"
        >
          <Bars3Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </IconButton>
        <Typography
          variant="h6"
          className="text-gray-900 dark:text-white text-base font-bold truncate"
        >
          {pageTitle}
        </Typography>
      </div>

      {/* Right: Actions - All Separate */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <DarkModeToggle isMobile={true} />
        <LanguageSelector isMobile={true} />
        <NotificationsMenu isMobile={true} />
        <UserMenu isMobile={true} />
      </div>
    </div>
  );
}
