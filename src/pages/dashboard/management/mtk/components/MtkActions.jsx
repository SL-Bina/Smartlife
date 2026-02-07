import React from "react";
import { Button, Input } from "@material-tailwind/react";
import { useManagement } from "@/context/ManagementContext";

export function MtkActions({ search, onSearchChange, onCreateClick }) {
  const { state, actions } = useManagement();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2 items-center flex-wrap">
        <div className="w-[260px]">
          <Input
            label="Axtarış"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-300" }}
          />
        </div>

        <Button variant="outlined" color="blue-gray" onClick={() => actions.resetAll()} className="dark:text-gray-300">
          Scope sıfırla
        </Button>

        <div className="text-sm text-blue-gray-600 dark:text-gray-300">
          Seçilmiş MTK: <b>{state.mtkId ? (state.mtk?.name || `#${state.mtkId}`) : "yoxdur"}</b>
        </div>
      </div>

      <Button color="green" onClick={onCreateClick} className="bg-green-600 hover:bg-green-700">
        MTK yarat
      </Button>
    </div>
  );
}
