import React from "react";
import { useTranslation } from "react-i18next";

export function ProfileHeader() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 my-2 p-3 rounded-lg shadow-lg mb-3 border border-blue-500 dark:border-blue-700 flex-shrink-0">
      <h3 className="text-white font-bold text-base">{t("profile.pageTitle") || "Profil"}</h3>
    </div>
  );
}

