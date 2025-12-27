import React from "react";
import { Button, Typography, Switch } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function PropertiesActions({ onFilterClick, onCreateClick, sortAscending, onSortChange }) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant="outlined"
          color="blue"
          onClick={onFilterClick}
          className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          {t("properties.actions.search")}
        </Button>
        <Button color="green" onClick={onCreateClick} className="dark:bg-green-600 dark:hover:bg-green-700">
          {t("properties.actions.add")}
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
          {sortAscending ? t("properties.sort.ascending") : t("properties.sort.descending")}
        </Typography>
        <Switch
          checked={sortAscending}
          onChange={(e) => onSortChange(e.target.checked)}
          color="blue"
          className="dark:bg-gray-700"
          labelProps={{
            className: "hidden",
          }}
        />
      </div>
    </>
  );
}

