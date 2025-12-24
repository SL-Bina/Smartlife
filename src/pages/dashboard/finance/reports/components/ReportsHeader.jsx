import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export function ReportsHeader({ startDate, endDate, currency, onFilterClick, onExportClick }) {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-black dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-red-600 dark:border-gray-700 mt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Typography variant="h5" className="text-white font-bold">
          {t("reports.pageTitle")} {formatDate(startDate)} - {formatDate(endDate)} ({currency})
        </Typography>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outlined"
            color="blue"
            size="sm"
            className="flex items-center gap-2 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/20"
            onClick={onExportClick}
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            {t("reports.actions.export")}
          </Button>
          <Button
            variant="outlined"
            color="blue"
            size="sm"
            onClick={onFilterClick}
            className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/20"
          >
            {t("reports.actions.search")}
          </Button>
        </div>
      </div>
    </div>
  );
}

