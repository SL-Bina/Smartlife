import React, { useEffect } from "react";
import { Button, Input } from "@material-tailwind/react";
import { useManagement } from "@/context/ManagementContext";
import AppSelect from "@/components/ui/AppSelect";

export function ComplexActions({ search, onSearchChange, onCreateClick, mtks = [], loadingMtks = false }) {
  const { state, actions } = useManagement();

  // Əgər MTK seçilməyib və mtks array-i varsa, birinci MTK-nı avtomatik seç
  useEffect(() => {
    if (!state.mtkId && mtks.length > 0 && !loadingMtks) {
      actions.setMtk(mtks[0].id, mtks[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mtks.length, loadingMtks, state.mtkId]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-wrap">
        <div className="w-[260px]">
          <Input
            label="Axtarış"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-300" }}
          />
        </div>

        <div className="w-[280px]">
          <AppSelect
            items={mtks}
            value={state.mtkId || (mtks.length > 0 ? mtks[0].id : null)}
            loading={loadingMtks}
            placeholder="MTK seç"
            allowAll={false}
            getValue={(x) => x.id}
            getLabel={(x) => x.name}
            onChange={(id, obj) => actions.setMtk(id, obj)}
          />
        </div>

        <Button
          variant="outlined"
          color="blue-gray"
          onClick={() => actions.resetAll()}
          className="dark:text-gray-300"
        >
          Scope sıfırla
        </Button>
      </div>

      <Button color="red" onClick={onCreateClick} className="bg-red-600 hover:bg-red-700">
        Kompleks yarat
      </Button>
    </div>
  );
}
