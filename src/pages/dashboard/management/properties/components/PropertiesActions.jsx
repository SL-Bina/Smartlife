import React from "react";
import { Button, IconButton, Select, Option, Spinner } from "@material-tailwind/react";
import { FunnelIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { usePropertiesLookups } from "../hooks/usePropertiesLookups";

/**
 * Tam işlək versiya:
 * - Select-lər "selected" göstərir (string/number mismatch fix)
 * - MTK seçəndə complex/building/block reset olur
 * - complex seçəndə building/block reset olur
 * - building seçəndə block reset olur
 * - disabled logic düzgün işləyir
 *
 * Qeyd:
 * usePropertiesFilters() içində filters bu key-ləri SAXLAMALIDIR:
 * { mtk_id, complex_id, building_id, block_id }
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

  // ✅ HƏR ŞEYİ string-ə çeviririk ki Select option-larla match eləsin
  const v = (x) => (x === null || x === undefined ? "" : String(x));

  const mtkId = v(filters?.mtk_id);
  const complexId = v(filters?.complex_id);
  const buildingId = v(filters?.building_id);
  const blockId = v(filters?.block_id);

  const { loading, mtks, complexes, buildings, blocks } = usePropertiesLookups(true, {
    mtk_id: mtkId,
    complex_id: complexId,
    building_id: buildingId,
    block_id: blockId,
  });

  const canSelectComplex = !!mtkId;
  const canSelectBuilding = !!complexId;
  const canSelectBlock = !!buildingId;

  const setMtk = (val) => {
    const next = v(val);
    onFilterChange?.("mtk_id", next);
    onFilterChange?.("complex_id", "");
    onFilterChange?.("building_id", "");
    onFilterChange?.("block_id", "");
  };

  const setComplex = (val) => {
    const next = v(val);
    onFilterChange?.("complex_id", next);
    onFilterChange?.("building_id", "");
    onFilterChange?.("block_id", "");
  };

  const setBuilding = (val) => {
    const next = v(val);
    onFilterChange?.("building_id", next);
    onFilterChange?.("block_id", "");
  };

  const setBlock = (val) => {
    const next = v(val);
    onFilterChange?.("block_id", next);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
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

          <div className="min-w-[170px]">
            <Select
              value={v(viewMode)}
              onChange={(val) => onViewModeChange?.(v(val))}
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

          {v(viewMode) === "floor" && (
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

          {loading && (
            <div className="flex items-center gap-2 text-xs text-blue-gray-400 dark:text-gray-400 px-2">
              <Spinner className="h-4 w-4" />
              {t("common.loading") || "Yüklənir..."}
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
          {t("properties.actions.create") || "Mənzil yarat"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* MTK */}
        <div className="min-w-0">
          <Select
            value={mtkId}
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
              <Option key={m.id} value={v(m.id)} className="dark:text-gray-200 dark:hover:bg-gray-700">
                {m.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Complex */}
        <div className="min-w-0">
          <Select
            value={complexId}
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
              <Option key={c.id} value={v(c.id)} className="dark:text-gray-200 dark:hover:bg-gray-700">
                {c.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Building */}
        <div className="min-w-0">
          <Select
            value={buildingId}
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
              <Option key={b.id} value={v(b.id)} className="dark:text-gray-200 dark:hover:bg-gray-700">
                {b.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Block */}
        <div className="min-w-0">
          <Select
            value={blockId}
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
              <Option key={bl.id} value={v(bl.id)} className="dark:text-gray-200 dark:hover:bg-gray-700">
                {bl.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
