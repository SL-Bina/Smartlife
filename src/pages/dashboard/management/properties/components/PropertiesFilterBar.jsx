/**
 * Properties Filter Bar Component
 * 
 * Bu komponent cascade filter UI təmin edir:
 * MTK → Complex → Building → Block
 */

import React from "react";
import { Card, CardBody, Typography, Select, Option, Input, Button } from "@material-tailwind/react";
import { useManagementEnhanced } from "@/context/ManagementContextEnhanced";
import { useFilterOptions } from "@/hooks/management/useSelectors";

export function PropertiesFilterBar() {
  const { state, actions } = useManagementEnhanced();
  const filterOptions = useFilterOptions();

  const handleFilterChange = (key, value) => {
    actions.setFilter(key, value);
  };

  const handleSearchChange = (e) => {
    actions.setFilter("search", e.target.value);
  };

  const handleStatusChange = (value) => {
    actions.setFilter("status", value || null);
  };

  const handleClearFilters = () => {
    actions.clearFilters();
  };

  const hasActiveFilters = 
    state.filters.mtkId ||
    state.filters.complexId ||
    state.filters.buildingId ||
    state.filters.blockId ||
    state.filters.search ||
    state.filters.status;

  return (
    <Card className="shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardBody className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* MTK Filter */}
          <div className="flex-1 min-w-[200px]">
            <Typography variant="small" className="mb-2 text-blue-gray-600 dark:text-gray-300">
              MTK
            </Typography>
            <Select
              value={state.filters.mtkId ? String(state.filters.mtkId) : ""}
              onChange={(val) => handleFilterChange("mtkId", val ? parseInt(val, 10) : null)}
              className="dark:text-gray-300"
            >
              <Option value="">Hamısı</Option>
              {filterOptions.mtks.map((mtk) => (
                <Option key={mtk.id} value={String(mtk.id)}>
                  {mtk.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Complex Filter */}
          <div className="flex-1 min-w-[200px]">
            <Typography variant="small" className="mb-2 text-blue-gray-600 dark:text-gray-300">
              Kompleks
            </Typography>
            <Select
              value={state.filters.complexId ? String(state.filters.complexId) : ""}
              onChange={(val) => handleFilterChange("complexId", val ? parseInt(val, 10) : null)}
              disabled={!state.filters.mtkId && filterOptions.complexes.length === 0}
              className="dark:text-gray-300"
            >
              <Option value="">Hamısı</Option>
              {filterOptions.complexes.map((complex) => (
                <Option key={complex.id} value={String(complex.id)}>
                  {complex.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Building Filter */}
          <div className="flex-1 min-w-[200px]">
            <Typography variant="small" className="mb-2 text-blue-gray-600 dark:text-gray-300">
              Bina
            </Typography>
            <Select
              value={state.filters.buildingId ? String(state.filters.buildingId) : ""}
              onChange={(val) => handleFilterChange("buildingId", val ? parseInt(val, 10) : null)}
              disabled={!state.filters.complexId && !state.filters.mtkId && filterOptions.buildings.length === 0}
              className="dark:text-gray-300"
            >
              <Option value="">Hamısı</Option>
              {filterOptions.buildings.map((building) => (
                <Option key={building.id} value={String(building.id)}>
                  {building.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Block Filter */}
          <div className="flex-1 min-w-[200px]">
            <Typography variant="small" className="mb-2 text-blue-gray-600 dark:text-gray-300">
              Blok
            </Typography>
            <Select
              value={state.filters.blockId ? String(state.filters.blockId) : ""}
              onChange={(val) => handleFilterChange("blockId", val ? parseInt(val, 10) : null)}
              disabled={
                !state.filters.buildingId &&
                !state.filters.complexId &&
                !state.filters.mtkId &&
                filterOptions.blocks.length === 0
              }
              className="dark:text-gray-300"
            >
              <Option value="">Hamısı</Option>
              {filterOptions.blocks.map((block) => (
                <Option key={block.id} value={String(block.id)}>
                  {block.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <Typography variant="small" className="mb-2 text-blue-gray-600 dark:text-gray-300">
              Axtarış
            </Typography>
            <Input
              type="text"
              value={state.filters.search}
              onChange={handleSearchChange}
              placeholder="Ad, nömrə..."
              className="dark:text-gray-300"
            />
          </div>

          {/* Status Filter */}
          <div className="flex-1 min-w-[150px]">
            <Typography variant="small" className="mb-2 text-blue-gray-600 dark:text-gray-300">
              Status
            </Typography>
            <Select
              value={state.filters.status || ""}
              onChange={handleStatusChange}
              className="dark:text-gray-300"
            >
              <Option value="">Hamısı</Option>
              <Option value="active">Aktiv</Option>
              <Option value="inactive">Qeyri-aktiv</Option>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outlined"
              size="sm"
              onClick={handleClearFilters}
              className="dark:text-gray-300 dark:border-gray-600"
            >
              Təmizlə
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}


