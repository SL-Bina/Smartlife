import React from "react";
import { Button, Input, IconButton } from "@material-tailwind/react";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useManagement } from "@/context/ManagementContext";

export function MtkActions({ search, onSearchChange, onCreateClick, onFilterClick, hasActiveFilters = false }) {
  const { state, actions } = useManagement();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3 items-center flex-wrap">
        <div className="w-full sm:w-[280px]">
          <Input
            label="Axtarış"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-300" }}
          />
        </div>


        <Button
          variant="outlined"
          color="blue-gray"
          onClick={() => actions.resetAll()}
          className="dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Scope sıfırla
        </Button>

        {state.mtkId && (
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-gray-700 text-sm text-blue-gray-700 dark:text-gray-300">
            Seçilmiş MTK: <b className="text-blue-600 dark:text-blue-400">{state.mtk?.name || `#${state.mtkId}`}</b>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outlined" color="blue-gray" onClick={onFilterClick} className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white hover:shadow-lg flex items-center gap-2">
          <FunnelIcon className="h-5 w-5" />
          Axtarış
        </Button>
        <Button
          onClick={onCreateClick}
          variant="outlined"
          className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:shadow-lg flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          MTK əlavə et
        </Button>
      </div>
    </div>
  );
}
