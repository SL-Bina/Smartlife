import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import { DocumentArrowDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtorApartmentsHeader({ onFilterClick, onExportClick }) {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-black dark:bg-gray-800 my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Typography variant="h5" className="text-white font-bold">
          {t("debtorApartments.pageTitle")}
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
            {t("debtorApartments.actions.export") || "Excelə köçür"}
          </Button>
          <Button
            variant="outlined"
            color="blue"
            size="sm"
            onClick={onFilterClick}
            className="flex items-center gap-2 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/20"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            {t("debtorApartments.actions.search") || "Axtarış"}
          </Button>
        </div>
      </div>
    </div>
  );
}

