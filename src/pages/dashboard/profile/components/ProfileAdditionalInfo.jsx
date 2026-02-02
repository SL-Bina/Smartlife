import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { CalendarIcon, UserCircleIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ProfileAdditionalInfo({ user }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 flex-1 min-h-0 flex flex-col w-1/2">
      <CardBody className="p-3 dark:bg-gray-800 flex-1 flex flex-col min-h-0">
        <Typography variant="h6" className="mb-3 font-bold text-blue-gray-900 dark:text-white text-xs flex-shrink-0">
          {t("profile.additionalInfo") || "ƏLAVƏ MƏLUMATLAR"}
        </Typography>

        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold">
                  {t("profile.birthDate") || "Doğum tarixi"}
                </Typography>
                <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs break-words">
                  {user?.birthday
                    ? (() => {
                        const dateStr = user.birthday.includes("T") ? user.birthday.split("T")[0] : user.birthday;
                        const date = new Date(dateStr);
                        return date.toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" });
                      })()
                    : "—"}
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
                <UserCircleIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold">
                  {t("profile.personalCode") || "Şəxsi kod"}
                </Typography>
                <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs break-words">
                  {user?.personal_code || "—"}
                </Typography>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 flex-1">
            <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg flex-shrink-0">
              <MapPinIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0 flex-1">
              <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold">
                {t("profile.address") || "Ünvan"}
              </Typography>
              <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs break-words">
                {user?.address || "—"}
              </Typography>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
