import React from "react";
import { XMarkIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { IconButton, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { setOpenConfigurator } from "@/context";

export function ConfiguratorHeader({ dispatch }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
          <Cog6ToothIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <Typography variant="h6" className="font-bold text-gray-900 dark:text-white text-base">
            {t("configurator.title")}
          </Typography>
          <Typography className="font-normal text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {t("configurator.description")}
          </Typography>
        </div>
      </div>
      <IconButton
        variant="text"
        size="sm"
        ripple={false}
        onClick={() => setOpenConfigurator(dispatch, false)}
        className="!p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <XMarkIcon strokeWidth={2} className="h-5 w-5" />
      </IconButton>
    </div>
  );
}

