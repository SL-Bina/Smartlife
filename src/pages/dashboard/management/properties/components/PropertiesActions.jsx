import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { FunnelIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function PropertiesActions({ onFilterClick, onCreateClick, sortAscending, onSortChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
      <div className="flex gap-2">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onFilterClick}
          className="flex items-center gap-2 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <FunnelIcon className="h-4 w-4" />
          {t("properties.actions.filter") || "Filter"}
        </Button>

        <IconButton
          variant="outlined"
          color="blue-gray"
          onClick={() => onSortChange(!sortAscending)}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          title={
            sortAscending
              ? t("properties.actions.sortAsc") || "Mərtəbə ↑"
              : t("properties.actions.sortDesc") || "Mərtəbə ↓"
          }
        >
          {sortAscending ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )}
        </IconButton>

      </div>

      <div className="flex-1" />

      <Button
        color="red"
        onClick={onCreateClick}
        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
      >
        <PlusIcon className="h-4 w-4" />
        {t("properties.actions.create") || "Mənzil yarat"}
      </Button>
    </div>
  );
}
