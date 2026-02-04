import React from "react";
import { useTranslation } from "react-i18next";

export function ProfileHeader() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-black dark:bg-gray-800 my-2 p-3 rounded-lg shadow-lg mb-3 border border-red-600 dark:border-gray-700 flex-shrink-0">
      <h3 className="text-white font-bold text-base">{t("profile.pageTitle")}</h3>
    </div>
  );
}
