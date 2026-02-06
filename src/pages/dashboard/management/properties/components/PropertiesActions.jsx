import React, { useMemo, useEffect } from "react";
import { Button, IconButton, Select, Option, Input, Spinner } from "@material-tailwind/react";
import { PlusIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useManagement } from "@/context/ManagementContext";
import AppSelect from "@/components/ui/AppSelect";

export function PropertiesActions({
  search,
  onSearchChange,
  onCreateClick,
  sortAscending,
  onSortChange,
  viewMode,
  onViewModeChange,
  mtks = [],
  complexes = [],
  buildings = [],
  blocks = [],
  loadingMtks = false,
  loadingComplexes = false,
  loadingBuildings = false,
  loadingBlocks = false,
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

  const filteredBlocks = useMemo(() => {
    const bid = state.buildingId;
    if (!bid) return blocks;

    return blocks.filter((bl) => {
      const id1 = bl?.building?.id;
      const id2 = bl?.building_id;
      return String(id1 || id2 || "") === String(bid);
    });
  }, [blocks, state.buildingId]);

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

  // Əgər Block seçilməyib və filteredBlocks array-i varsa, birinci Block-u avtomatik seç
  useEffect(() => {
    if (!state.blockId && filteredBlocks.length > 0 && !loadingBlocks && state.buildingId) {
      actions.setBlock(filteredBlocks[0].id, filteredBlocks[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredBlocks.length, loadingBlocks, state.blockId, state.buildingId]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-[260px]">
            <Input
              label="Axtarış"
              value={search || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-300" }}
            />
          </div>

          <div className="min-w-[170px]">
            <Select
              value={viewMode || "floor"}
              onChange={(val) => onViewModeChange?.(val)}
              label="Görünüş"
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-300" }}
              menuProps={{ className: "dark:bg-gray-800 dark:border-gray-700" }}
            >
              <Option value="floor" className="dark:text-gray-200 dark:hover:bg-gray-700">
                Floor view
              </Option>
              <Option value="table" className="dark:text-gray-200 dark:hover:bg-gray-700">
                Table view
              </Option>
            </Select>
          </div>

          {viewMode === "floor" && (
            <IconButton
              variant="outlined"
              color="blue-gray"
              onClick={() => onSortChange?.(!sortAscending)}
              className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              title={sortAscending ? "Mərtəbə ↑" : "Mərtəbə ↓"}
            >
              {sortAscending ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
            </IconButton>
          )}

          {(loadingMtks || loadingComplexes || loadingBuildings || loadingBlocks) && (
            <div className="flex items-center gap-2 text-xs text-blue-gray-400 dark:text-gray-400 px-2">
              <Spinner className="h-4 w-4" />
              Yüklənir...
            </div>
          )}
        </div>

        <div className="flex-1" />

        <Button
          color="red"
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
        >
          <PlusIcon className="h-4 w-4" />
          Mənzil yarat
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-wrap">
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
              actions.setMtk(id, obj);
              actions.setComplex(null, null);
              actions.setBuilding(null, null);
              actions.setBlock(null, null);
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
              actions.setComplex(id, obj);
              actions.setBuilding(null, null);
              actions.setBlock(null, null);
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
            onChange={(id, obj) => {
              actions.setBuilding(id, obj);
              actions.setBlock(null, null);
            }}
          />
        </div>

        <div className="w-[300px]">
          <AppSelect
            items={filteredBlocks}
            value={state.blockId || (filteredBlocks.length > 0 ? filteredBlocks[0].id : null)}
            loading={loadingBlocks}
            placeholder="Blok seç"
            allowAll={false}
            getValue={(x) => x.id}
            getLabel={(x) => x.name}
            onChange={(id, obj) => actions.setBlock(id, obj)}
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
    </div>
  );
}
