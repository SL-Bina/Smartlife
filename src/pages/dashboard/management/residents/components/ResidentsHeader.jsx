import React from "react";
import { useTranslation } from "react-i18next";

export function ResidentsHeader() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-black dark:bg-gray-800 my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-gray-700">
      <h3 className="text-white font-bold">{t("residents.pageTitle")}</h3>
    </div>
  );
}

