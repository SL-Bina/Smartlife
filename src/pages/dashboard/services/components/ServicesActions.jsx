import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ServicesActions({ onFilterClick, onCreateClick }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <IconButton
        variant="text"
        color="blue-gray"
        onClick={onFilterClick}
        className="dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </IconButton>
      <Button
        color="green"
        size="sm"
        onClick={onCreateClick}
        className="flex items-center gap-2 dark:bg-green-600 dark:hover:bg-green-700"
      >
        <PlusIcon className="h-4 w-4" />
        <span>{t("services.add")}</span>
      </Button>
    </div>
  );
}

