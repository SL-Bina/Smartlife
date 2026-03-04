import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DeviceHeader({
  onOpenAccessRules,
  onOpenDeviceUsers,
  onOpenDeviceIdentifiers,
  onOpenDeviceLogs,
}) {
  const { t } = useTranslation();

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 mt-2 sm:mt-3 md:mt-4"
      style={{ position: "relative", zIndex: 0 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 dark:border-gray-600/30 bg-white/20">
            <CpuChipIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
          </div>
        </div>

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              <Typography
                variant="h4"
                className="text-white font-bold mb-1 text-lg sm:text-xl md:text-2xl"
              >
                {t("devices.pageTitle") || "Cihazlar"}
              </Typography>
              <Typography className="text-white/90 dark:text-gray-300 text-xs sm:text-sm font-medium">
                {t("devices.pageSubtitle") || "Cihaz siyahısı, icazə qaydaları, istifadəçilər, loglar"}
              </Typography>
            </div>

            {/* Quick-action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outlined"
                onClick={onOpenAccessRules}
                className="border-white/40 text-white hover:bg-white/20 text-xs px-3 py-1.5 whitespace-nowrap"
              >
                {t("devices.actions.accessRules") || "İcazə qaydaları"}
              </Button>
              <Button
                size="sm"
                variant="outlined"
                onClick={onOpenDeviceUsers}
                className="border-white/40 text-white hover:bg-white/20 text-xs px-3 py-1.5 whitespace-nowrap"
              >
                {t("devices.actions.deviceUsers") || "İstifadəçilər"}
              </Button>
              <Button
                size="sm"
                variant="outlined"
                onClick={onOpenDeviceIdentifiers}
                className="border-white/40 text-white hover:bg-white/20 text-xs px-3 py-1.5 whitespace-nowrap"
              >
                {t("devices.actions.deviceIdentifiers") || "İdentifikatorlar"}
              </Button>
              <Button
                size="sm"
                variant="outlined"
                onClick={onOpenDeviceLogs}
                className="border-white/40 text-white hover:bg-white/20 text-xs px-3 py-1.5 whitespace-nowrap"
              >
                {t("devices.actions.deviceLogs") || "Loglar"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
      <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12" />
    </div>
  );
}
