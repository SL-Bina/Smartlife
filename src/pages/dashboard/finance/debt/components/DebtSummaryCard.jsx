import React from "react";
import { useTranslation } from "react-i18next";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

export function DebtSummaryCard({ totalDebt }) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end mb-4">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 flex items-center gap-4 min-w-[220px]">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <CurrencyDollarIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{t("debt.summary.totalDebt")}</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{totalDebt} ₼</p>
        </div>
      </div>
    </div>
  );
}

