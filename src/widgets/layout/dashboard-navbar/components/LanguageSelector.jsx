import React from "react";
import { IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { languages } from "../utils/languages";

export function LanguageSelector({ isMobile = false }) {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const buttonClass = isMobile
    ? "dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all p-1.5"
    : "dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all p-1";

  const currentLanguage = languages.find((lng) => lng.code === i18n.language) || languages[0];

  return (
    <Menu placement={isMobile ? "bottom-start" : "bottom-end"}>
      <MenuHandler>
        <IconButton
          variant="text"
          color="blue-gray"
          className={buttonClass}
          size="sm"
        >
          <div className={`${isMobile ? "w-6 h-6" : "w-10 h-10"} flex items-center justify-center rounded`}>
            <ReactCountryFlag
              countryCode={currentLanguage.countryCode}
              svg
              style={{ width: isMobile ? "1.5em" : "2em", height: isMobile ? "1.5em" : "2em", borderRadius: "4px" }}
            />
          </div>
        </IconButton>
      </MenuHandler>
      <MenuList className="min-w-[180px] dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow-xl">
        {languages.map((lng) => (
          <MenuItem
            key={lng.code}
            onClick={() => changeLanguage(lng.code)}
            className={`dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 flex items-center gap-3 rounded-lg ${i18n.language === lng.code ? "bg-gradient-to-r from-red-600/10 to-red-500/5" : ""}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i18n.language === lng.code ? "bg-red-600/20 dark:bg-red-600/30" : "bg-gray-200/50 dark:bg-gray-700/50"}`}>
              <ReactCountryFlag
                countryCode={lng.countryCode}
                svg
                style={{ width: "1.5em", height: "1.5em", borderRadius: "4px" }}
              />
            </div>
            <span className="font-semibold">{lng.label}</span>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
