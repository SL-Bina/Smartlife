import React from "react";
import { Button } from "@material-tailwind/react";
import { CalendarIcon, ListBulletIcon, MagnifyingGlassIcon, TagIcon, ArrowDownTrayIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ApplicationsListActions({ onFilterClick, onCreateClick, onCategoryClick, onPrioritiesClick }) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = React.useState("list");

  return (
    <div className="flex flex-wrap items-center gap-2 justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={viewMode === "calendar" ? "filled" : "outlined"}
          color={viewMode === "calendar" ? "blue" : "blue-gray"}
          size="sm"
          onClick={() => setViewMode("calendar")}
          className={`flex items-center gap-2 ${
            viewMode === "calendar"
              ? "dark:bg-blue-600 dark:hover:bg-blue-700"
              : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <CalendarIcon className="h-4 w-4" />
          <span>{t("applications.list.calendar") || "Təqvim"}</span>
        </Button>
        <Button
          variant={viewMode === "list" ? "filled" : "outlined"}
          color={viewMode === "list" ? "blue" : "blue-gray"}
          size="sm"
          onClick={() => setViewMode("list")}
          className={`flex items-center gap-2 ${
            viewMode === "list"
              ? "dark:bg-blue-600 dark:hover:bg-blue-700"
              : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <ListBulletIcon className="h-4 w-4" />
          <span>{t("applications.list.list") || "Siyahı"}</span>
        </Button>
        <Button
          variant="outlined"
          color="blue-gray"
          size="sm"
          onClick={onFilterClick}
          className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          <span>{t("applications.list.search") || "Axtarış"}</span>
        </Button>
        <Button
          variant="outlined"
          color="pink"
          size="sm"
          onClick={onCategoryClick}
          className="flex items-center gap-2 dark:border-pink-600 dark:text-pink-300 dark:hover:bg-pink-700/20"
        >
          <TagIcon className="h-4 w-4" />
          <span>{t("applications.list.category") || "Kateqoriya"}</span>
        </Button>
        <Button
          variant="outlined"
          color="green"
          size="sm"
          className="flex items-center gap-2 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-700/20"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span>{t("applications.list.excelExport") || "Excelə köçür"}</span>
        </Button>
        <Button
          variant="outlined"
          color="purple"
          size="sm"
          onClick={onPrioritiesClick}
          className="flex items-center gap-2 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-700/20"
        >
          <SparklesIcon className="h-4 w-4" />
          <span>{t("applications.list.priorities") || "Prioritetlər"}</span>
        </Button>
      </div>
      <Button
        color="green"
        size="sm"
        onClick={onCreateClick}
        className="dark:bg-green-600 dark:hover:bg-green-700"
      >
        {t("applications.list.newApplication") || "Yeni müraciət"}
      </Button>
    </div>
  );
}

