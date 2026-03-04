import React from "react";
import { Button } from "@material-tailwind/react";
import { DocumentArrowDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtorApartmentsActions({ onFilterClick, onExportClick }) {
  const { t } = useTranslation();

  return (
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
  );
}
