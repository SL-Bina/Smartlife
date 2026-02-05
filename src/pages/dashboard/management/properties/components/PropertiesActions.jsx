import React, { useMemo } from "react";
import { Button, IconButton, Select, Option, Spinner } from "@material-tailwind/react";
import { FunnelIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { usePropertiesLookups } from "../hooks/usePropertiesLookups";

/**
 * Props:
 * - onFilterClick()
 * - onCreateClick()
 * - sortAscending: boolean
 * - onSortChange(nextBool)
 *
 * - viewMode: "floor" | "table"
 * - onViewModeChange(mode)
 *
 * - filters: object (usePropertiesFilters().filters)
 * - onFilterChange(key, value)  => updateFilter(key, value)
 *
 * Qeyd:
 * filters içində bu key-lər olmalıdır:
 * - mtk_id, complex_id, building_id, block_id (string/number)
 */
export function PropertiesActions({
  onFilterClick,
  onCreateClick,
  sortAscending,
  onSortChange,

  viewMode,
  onViewModeChange,

  filters,
  onFilterChange,
}) {
  const { t } = useTranslation();

  // Actions açıq olduğu müddətdə lookups yüklənsin deyə true veririk
  // (istəsən bunu viewMode === "floor" olanda yüklə deyə bilərik)
  const { loading, mtks, complexes, buildings, blocks } = usePropertiesLookups(true, {
    mtk_id: filters?.mtk_id,
    complex_id: filters?.complex_id,
    building_id: filters?.building_id,
    block_id: filters?.block_id,
  });

  const canSelectComplex = !!filters?.mtk_id;
  const canSelectBuilding = !!filters?.complex_id;
  const canSelectBlock = !!filters?.building_id;

  // Cascading setters (FormModal-dakı kimi)
  const setMtk = (val) => {
    onFilterChange?.("mtk_id", val || "");
    onFilterChange?.("complex_id", "");
    onFilterChange?.("building_id", "");
    onFilterChange?.("block_id", "");
  };

  const setComplex = (val) => {
    onFilterChange?.("complex_id", val || "");
    onFilterChange?.("building_id", "");
    onFilterChange?.("block_id", "");
  };

  const setBuilding = (val) => {
    onFilterChange?.("building_id", val || "");
    onFilterChange?.("block_id", "");
  };

  const setBlock = (val) => {
    onFilterChange?.("block_id", val || "");
  };

  const viewLabel = useMemo(() => {
    if (viewMode === "floor") return t("properties.actions.floorView") || "Floor view";
    return t("properties.actions.tableView") || "Table view";
  }, [viewMode, t]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* TOP ROW: left controls + right create */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        {/* LEFT CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onFilterClick}
            className="flex items-center gap-2 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <FunnelIcon className="h-4 w-4" />
            {t("properties.actions.filter") || "Filter"}
          </Button>

          {/* VIEW MODE */}
          <div className="min-w-[170px]">
            <Select
              value={viewMode}
              onChange={(val) => onViewModeChange?.(val)}
              label={t("properties.actions.viewMode") || "Görünüş"}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-300" }}
              menuProps={{ className: "dark:bg-gray-800 dark:border-gray-700" }}
            >
              <Option value="floor" className="dark:text-gray-200 dark:hover:bg-gray-700">
                {t("properties.actions.floorView") || "Floor view"}
              </Option>
              <Option value="table" className="dark:text-gray-200 dark:hover:bg-gray-700">
                {t("properties.actions.tableView") || "Table view"}
              </Option>
            </Select>
          </div>

          {/* SORT only in floor */}
          {viewMode === "floor" && (
            <IconButton
              variant="outlined"
              color="blue-gray"
              onClick={() => onSortChange?.(!sortAscending)}
              className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              title={
                sortAscending
                  ? t("properties.actions.sortAsc") || "Mərtəbə ↑"
                  : t("properties.actions.sortDesc") || "Mərtəbə ↓"
              }
            >
              {sortAscending ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
            </IconButton>
          )}

          {/* loading hint */}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-blue-gray-400 dark:text-gray-400 px-2">
              <Spinner className="h-4 w-4" />
              {t("common.loading") || "Yüklənir..."}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* RIGHT CREATE */}
        <Button
          color="red"
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
        >
          <PlusIcon className="h-4 w-4" />
          {t("properties.actions.create") || "Mənzil yarat"}
        </Button>
      </div>

      {/* SECOND ROW: Cascading selects (floor üçün) */}
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* MTK */}
          <div className="min-w-0">
            <Select
              value={filters?.mtk_id || ""}
              onChange={(val) => setMtk(val)}
              label={t("properties.form.fields.mtk") || "MTK"}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-300" }}
              menuProps={{ className: "dark:bg-gray-800 dark:border-gray-700" }}
            >
              <Option value="" className="dark:text-gray-200 dark:hover:bg-gray-700">
                {t("common.select") || "Seçin..."}
              </Option>
              {(mtks || []).map((m) => (
                <Option key={m.id} value={String(m.id)} className="dark:text-gray-200 dark:hover:bg-gray-700">
                  {m.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Complex */}
          <div className="min-w-0">
            <Select
              value={filters?.complex_id || ""}
              onChange={(val) => setComplex(val)}
              label={t("properties.form.fields.complex") || "Kompleks"}
              disabled={!canSelectComplex}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-300" }}
              menuProps={{ className: "dark:bg-gray-800 dark:border-gray-700" }}
            >
              <Option value="" className="dark:text-gray-200 dark:hover:bg-gray-700">
                {t("common.select") || "Seçin..."}
              </Option>
              {(complexes || []).map((c) => (
                <Option key={c.id} value={String(c.id)} className="dark:text-gray-200 dark:hover:bg-gray-700">
                  {c.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Building */}
          <div className="min-w-0">
            <Select
              value={filters?.building_id || ""}
              onChange={(val) => setBuilding(val)}
              label={t("properties.form.fields.building") || "Bina"}
              disabled={!canSelectBuilding}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-300" }}
              menuProps={{ className: "dark:bg-gray-800 dark:border-gray-700" }}
            >
              <Option value="" className="dark:text-gray-200 dark:hover:bg-gray-700">
                {t("common.select") || "Seçin..."}
              </Option>
              {(buildings || []).map((b) => (
                <Option key={b.id} value={String(b.id)} className="dark:text-gray-200 dark:hover:bg-gray-700">
                  {b.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Block */}
          <div className="min-w-0">
            <Select
              value={filters?.block_id || ""}
              onChange={(val) => setBlock(val)}
              label={t("properties.form.fields.block") || "Blok"}
              disabled={!canSelectBlock}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-300" }}
              menuProps={{ className: "dark:bg-gray-800 dark:border-gray-700" }}
            >
              <Option value="" className="dark:text-gray-200 dark:hover:bg-gray-700">
                {t("common.select") || "Seçin..."}
              </Option>
              {(blocks || []).map((bl) => (
                <Option key={bl.id} value={String(bl.id)} className="dark:text-gray-200 dark:hover:bg-gray-700">
                  {bl.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
    </div>
  );
}
