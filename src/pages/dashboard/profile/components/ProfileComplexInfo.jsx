import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ProfileComplexInfo({ user }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 flex-1 min-h-0 flex flex-col w-1/2">
      <CardBody className="p-3 dark:bg-gray-800 flex-1 flex flex-col min-h-0">
        <Typography variant="h6" className="mb-2 font-bold text-blue-gray-900 dark:text-white text-xs flex-shrink-0">
          {t("profile.complexInfo") || "KOMPLEKS MƏLUMATLARI"}
        </Typography>
        <div className="flex-1 flex items-center">
          <Card className="border border-green-200 dark:border-green-800 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/20 hover:shadow-md transition-shadow w-full">
            <CardBody className="p-2.5 flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg shadow-sm">
                <HomeIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-0.5 font-semibold">
                  {t("profile.complex") || "Kompleks"}
                </Typography>
                <Typography variant="small" className="text-blue-gray-900 dark:text-white font-bold text-sm truncate">
                  {user?.email?.split("@")[1]?.split(".")[0] || "SmartLife"}
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
}
