import React from "react";
import { Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ComplexActions({ onFilterClick, onCreateClick }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outlined"
        color="blue"
        onClick={onFilterClick}
        className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
      >
        {t("complexes.actions.search")}
      </Button>
      <Button color="green" onClick={onCreateClick} className="dark:bg-green-600 dark:hover:bg-green-700">
        {t("complexes.actions.add")}
      </Button>
    </div>
  );
}
