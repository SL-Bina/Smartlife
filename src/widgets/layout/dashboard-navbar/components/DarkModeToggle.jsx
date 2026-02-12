import React from "react";
import { IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setDarkMode } from "@/store/exports";
import { useTranslation } from "react-i18next";

export function DarkModeToggle({ isMobile = false }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { darkMode } = controller;
  const { t } = useTranslation();

  const buttonClass = isMobile
    ? "dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all p-2"
    : "dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all p-1";

  return (
    <Menu placement={isMobile ? "bottom-start" : "bottom-end"}>
      <MenuHandler>
        <IconButton
          variant="text"
          color="blue-gray"
          className={buttonClass}
          size="sm"
        >
          {darkMode ? (
            <SunIcon className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-yellow-500`} />
          ) : (
            <MoonIcon className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-gray-700 dark:text-gray-300`} />
          )}
        </IconButton>
      </MenuHandler>
      <MenuList className="dark:bg-gray-800 dark:border-gray-700 min-w-[160px] rounded-xl shadow-xl">
        <MenuItem
          onClick={() => setDarkMode(dispatch, false)}
          className={`dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 flex items-center gap-3 rounded-lg ${!darkMode ? "bg-gradient-to-r from-red-600/10 to-red-500/5" : ""}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${!darkMode ? "bg-red-600/20 dark:bg-red-600/30" : "bg-gray-200/50 dark:bg-gray-700/50"}`}>
            <SunIcon className="h-4 w-4 text-yellow-500" />
          </div>
          <span className="font-semibold">{t("header.lightMode")}</span>
        </MenuItem>
        <MenuItem
          onClick={() => setDarkMode(dispatch, true)}
          className={`dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 flex items-center gap-3 rounded-lg ${darkMode ? "bg-gradient-to-r from-red-600/10 to-red-500/5" : ""}`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? "bg-red-600/20 dark:bg-red-600/30" : "bg-gray-200/50 dark:bg-gray-700/50"}`}>
            <MoonIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </div>
          <span className="font-semibold">{t("header.darkMode")}</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
