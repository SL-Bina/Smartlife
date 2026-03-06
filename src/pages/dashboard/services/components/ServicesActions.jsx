import React from "react";
import { Typography } from "@material-tailwind/react";
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";

export function ServicesActions({ onFilterClick, onCreateClick, total, searchName, onSearchNameChange }) {
  const { t } = useTranslation();
  const { getRgba, getActiveGradient } = useMtkColor();

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-5 lg:p-6">
      {/* Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Typography variant="h6" className="text-gray-800 dark:text-gray-100 font-bold text-sm">
              {t("services.list") || "Servis siyahısı"}
            </Typography>
            {total !== undefined && (
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white leading-none"
                style={{ background: getActiveGradient(0.85, 0.65) }}
              >
                {total}
              </span>
            )}
          </div>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: getActiveGradient(0.9, 0.72) }}
          >
            <PlusIcon className="h-4 w-4" />
            <span>{t("services.add") || "Yeni"}</span>
          </button>
        </div>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchName || ""}
            onChange={(e) => onSearchNameChange?.(e.target.value)}
            placeholder={t("services.searchByName") || "Ada görə axtar..."}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <button
          onClick={onFilterClick}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold transition-all hover:shadow-sm active:scale-95"
          style={{ borderColor: getRgba(0.3), color: getRgba(1), backgroundColor: getRgba(0.06) }}
        >
          <FunnelIcon className="h-4 w-4" />
          <span>{t("services.filter.title") || "Filter"}</span>
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {/* Title + badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Typography variant="h6" className="text-gray-800 dark:text-gray-100 font-bold text-base whitespace-nowrap">
            {t("services.list") || "Servis siyahısı"}
          </Typography>
          {total !== undefined && (
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white leading-none"
              style={{ background: getActiveGradient(0.85, 0.65) }}
            >
              {total}
            </span>
          )}
        </div>

        {/* Inline search */}
        <div className="relative max-w-xs w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchName || ""}
            onChange={(e) => onSearchNameChange?.(e.target.value)}
            placeholder={t("services.searchByName") || "Ada görə axtar..."}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="flex-1" />

        {/* Filter */}
        <button
          onClick={onFilterClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-semibold transition-all hover:shadow-sm active:scale-95 flex-shrink-0"
          style={{ borderColor: getRgba(0.3), color: getRgba(1), backgroundColor: getRgba(0.06) }}
        >
          <FunnelIcon className="h-4 w-4" />
          <span>{t("services.filter.title") || "Filter"}</span>
        </button>

        {/* Create */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md active:scale-95 flex-shrink-0"
          style={{ background: getActiveGradient(0.9, 0.72) }}
        >
          <PlusIcon className="h-4 w-4" />
          <span>{t("services.add") || "Yeni servis"}</span>
        </button>
      </div>
    </div>
  );
}

