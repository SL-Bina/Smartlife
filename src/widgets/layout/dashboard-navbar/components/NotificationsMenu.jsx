import React from "react";
import { IconButton, Menu, MenuHandler, MenuList, MenuItem, Avatar, Typography } from "@material-tailwind/react";
import { BellIcon, ClockIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

export function NotificationsMenu({ isMobile = false }) {
  const { t } = useTranslation();

  const buttonClass = isMobile
    ? "dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all p-2 relative"
    : "dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 relative rounded-xl transition-all p-1";

  const menuWidth = isMobile
    ? "w-[calc(100vw-1.5rem)] max-w-[360px]"
    : "w-80 lg:w-96";

  return (
    <Menu placement={isMobile ? "bottom-end" : "bottom-end"}>
      <MenuHandler>
        <IconButton
          variant="text"
          color="blue-gray"
          className={buttonClass}
          size="sm"
        >
          <BellIcon className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-gray-700 dark:text-gray-300`} />
          <span className={`absolute ${isMobile ? "top-1 right-1 h-2 w-2" : "top-0.5 right-0.5 h-3 w-3"} bg-red-600 rounded-full border border-white dark:border-gray-800`}></span>
        </IconButton>
      </MenuHandler>
      <MenuList className={`${menuWidth} dark:bg-gray-800 dark:border-gray-700 max-h-[400px] overflow-y-auto rounded-xl shadow-2xl`}>
        <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-800/50">
          <Typography variant="h6" className={`text-gray-900 dark:text-white font-bold ${isMobile ? "text-sm" : "text-base"}`}>
            {t("header.notifications")}
          </Typography>
        </div>
        <MenuItem className="flex items-center gap-3 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 rounded-xl">
          <Avatar
            src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
            alt="item-1"
            size="sm"
            variant="circular"
            className="border-2 border-gray-200 dark:border-gray-700"
          />
          <div className="flex-1 min-w-0">
            <Typography variant="small" className={`mb-1 font-semibold text-gray-900 dark:text-gray-200 ${isMobile ? "text-xs" : ""}`}>
              <strong>New message</strong> from Laur
            </Typography>
            <Typography variant="small" className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-3 w-3" /> 13 minutes ago
            </Typography>
          </div>
        </MenuItem>
        <MenuItem className="flex items-center gap-3 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 rounded-xl">
          <Avatar
            src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
            alt="item-2"
            size="sm"
            variant="circular"
            className="border-2 border-gray-200 dark:border-gray-700"
          />
          <div className="flex-1 min-w-0">
            <Typography variant="small" className={`mb-1 font-semibold text-gray-900 dark:text-gray-200 ${isMobile ? "text-xs" : ""}`}>
              <strong>New album</strong> by Travis Scott
            </Typography>
            <Typography variant="small" className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-3 w-3" /> 1 day ago
            </Typography>
          </div>
        </MenuItem>
        <MenuItem className="flex items-center gap-3 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 rounded-xl">
          <div className={`${isMobile ? "h-8 w-8" : "h-9 w-9"} grid place-items-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-500/30`}>
            <CreditCardIcon className={`${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} text-white`} />
          </div>
          <div className="flex-1 min-w-0">
            <Typography variant="small" className={`mb-1 font-semibold text-gray-900 dark:text-gray-200 ${isMobile ? "text-xs" : ""}`}>
              Payment successfully completed
            </Typography>
            <Typography variant="small" className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-3 w-3" /> 2 days ago
            </Typography>
          </div>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
