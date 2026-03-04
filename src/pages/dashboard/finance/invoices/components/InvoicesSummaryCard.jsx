import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export function InvoicesSummaryCard({ totalPaid, totalConsumption }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <CheckCircleIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{t("invoices.summary.totalPaid") || "Ödənilmiş"}</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{parseFloat(totalPaid || 0).toFixed(2)} ₼</p>
        </div>
      </div>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <DocumentTextIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{t("invoices.summary.totalConsumption") || "Ümumi istəhlak"}</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{parseFloat(totalConsumption || 0).toFixed(2)} ₼</p>
        </div>
      </div>
    </div>
  );
}

