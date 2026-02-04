import React from "react";
import { Switch, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ConfiguratorSwitch({
  id,
  titleKey,
  descriptionKey,
  checked,
  onChange,
  icon,
  iconBgColor = "bg-blue-50 dark:bg-blue-900/20",
  iconColor = "text-blue-600 dark:text-blue-400",
  disabled = false,
  opacity = false,
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm ${
        opacity ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-8 h-8 rounded-lg ${iconBgColor} flex items-center justify-center`}>
              {icon}
            </div>
            <Typography
              variant="small"
              className={`font-semibold text-sm ${
                opacity
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {t(titleKey)}
            </Typography>
          </div>
          <Typography
            variant="small"
            className={`text-xs leading-relaxed pl-10 ${
              opacity
                ? "text-gray-400 dark:text-gray-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {t(descriptionKey)}
          </Typography>
        </div>
        <Switch
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

