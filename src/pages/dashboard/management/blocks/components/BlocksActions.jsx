import React, { useMemo, useEffect } from "react";
import { Button, Input } from "@material-tailwind/react";
import { useManagement } from "@/context/ManagementContext";
import AppSelect from "@/components/ui/AppSelect";

export function BlocksActions({
  search,
  onSearchChange,
  onCreateClick,
  mtks = [],
  complexes = [],
  buildings = [],
  loadingMtks = false,
  loadingComplexes = false,
  loadingBuildings = false,
}) {
  const { state, actions } = useManagement();

  const filteredComplexes = useMemo(() => {
    const mid = state.mtkId;
    if (!mid) return complexes;

    return complexes.filter((c) => {
      const id1 = c?.bind_mtk?.id;
      const id2 = c?.mtk_id;
      return String(id1 || id2 || "") === String(mid);
    });
  }, [complexes, state.mtkId]);

  const filteredBuildings = useMemo(() => {
    const cid = state.complexId;
    if (!cid) return buildings;

    return buildings.filter((b) => {
      const id1 = b?.complex?.id;
      const id2 = b?.complex_id;
      return String(id1 || id2 || "") === String(cid);
    });
  }, [buildings, state.complexId]);

  // Əgər MTK seçilməyib və mtks array-i varsa, birinci MTK-nı avtomatik seç
  useEffect(() => {
    if (!state.mtkId && mtks.length > 0 && !loadingMtks) {
      actions.setMtk(mtks[0].id, mtks[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mtks.length, loadingMtks, state.mtkId]);

  // Əgər Complex seçilməyib və filteredComplexes array-i varsa, birinci Complex-i avtomatik seç
  useEffect(() => {
    if (!state.complexId && filteredComplexes.length > 0 && !loadingComplexes && state.mtkId) {
      actions.setComplex(filteredComplexes[0].id, filteredComplexes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredComplexes.length, loadingComplexes, state.complexId, state.mtkId]);

  // Əgər Building seçilməyib və filteredBuildings array-i varsa, birinci Building-i avtomatik seç
  useEffect(() => {
    if (!state.buildingId && filteredBuildings.length > 0 && !loadingBuildings && state.complexId) {
      actions.setBuilding(filteredBuildings[0].id, filteredBuildings[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredBuildings.length, loadingBuildings, state.buildingId, state.complexId]);

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
            onChange={(id, obj) => {
              // MTK dəyişəndə complex və building sıfırlansın
              actions.setMtk(id, obj);
              actions.setComplex(null, null);
              actions.setBuilding(null, null);
            }}
          />
        </div>

        <div className="w-[300px]">
          <AppSelect
            items={filteredComplexes}
            value={state.complexId || (filteredComplexes.length > 0 ? filteredComplexes[0].id : null)}
            loading={loadingComplexes}
            placeholder="Kompleks seç"
            allowAll={false}
            getValue={(x) => x.id}
            getLabel={(x) => x.name}
            onChange={(id, obj) => {
              // Complex dəyişəndə building sıfırlansın
              actions.setComplex(id, obj);
              actions.setBuilding(null, null);
            }}
          />
        </div>

        <div className="w-[300px]">
          <AppSelect
            items={filteredBuildings}
            value={state.buildingId || (filteredBuildings.length > 0 ? filteredBuildings[0].id : null)}
            loading={loadingBuildings}
            placeholder="Bina seç"
            allowAll={false}
            getValue={(x) => x.id}
            getLabel={(x) => x.name}
            onChange={(id, obj) => actions.setBuilding(id, obj)}
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
        Blok yarat
      </Button>
    </div>
  );
}
