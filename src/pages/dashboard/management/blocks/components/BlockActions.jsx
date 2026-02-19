import React, { useMemo, useState, useEffect } from "react";
import { Button, Input, Select, Option, Chip, Typography } from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AppSelect from "@/components/ui/AppSelect";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { loadMtks } from "@/store/slices/mtkSlice";
import { loadComplexes } from "@/store/slices/complexSlice";
import { loadBuildings } from "@/store/slices/buildingSlice";
import blockLookupsAPI from "../api/lookups";

const STANDARD_OPTIONS = [10, 20, 50, 75, 100];

export function BlockActions({ 
  search = {}, 
  mtkId = null,
  complexId = null,
  buildingId = null,
  onCreateClick, 
  onSearchClick,
  onNameSearchChange,
  onStatusChange,
  onMtkChange,
  onComplexChange,
  onBuildingChange,
  onRemoveFilter,
  onApplyNameSearch,
  totalItems = 0,
  itemsPerPage = 20,
  onItemsPerPageChange
}) {
  const dispatch = useAppDispatch();
  const mtks = useAppSelector((state) => state.mtk.mtks);
  const complexes = useAppSelector((state) => state.complex.complexes);
  const buildings = useAppSelector((state) => state.building.buildings);
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);
  
  const [localName, setLocalName] = useState(search?.name || "");
  const [filteredComplexes, setFilteredComplexes] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  useEffect(() => {
    setLocalName(search?.name || "");
  }, [search?.name]);

  useEffect(() => {
    if (mtks.length === 0) {
      dispatch(loadMtks({ page: 1, per_page: 1000 }));
    }
  }, [dispatch, mtks.length]);

  useEffect(() => {
    if (complexes.length === 0) {
      dispatch(loadComplexes({ page: 1, per_page: 1000 }));
    }
  }, [dispatch, complexes.length]);

  useEffect(() => {
    if (buildings.length === 0) {
      dispatch(loadBuildings({ page: 1, per_page: 1000 }));
    }
  }, [dispatch, buildings.length]);

  useEffect(() => {
    if (mtkId) {
      setLoadingComplexes(true);
      blockLookupsAPI.getComplexes({ mtk_id: mtkId })
        .then((data) => {
          setFilteredComplexes(data || []);
        })
        .catch((error) => {
          console.error("Error loading complexes:", error);
          setFilteredComplexes([]);
        })
        .finally(() => {
          setLoadingComplexes(false);
        });
    } else {
      setFilteredComplexes(complexes);
    }
  }, [mtkId, complexes]);

  useEffect(() => {
    if (complexId) {
      setLoadingBuildings(true);
      blockLookupsAPI.getBuildings({ complex_id: complexId })
        .then((data) => {
          setFilteredBuildings(data || []);
        })
        .catch((error) => {
          console.error("Error loading buildings:", error);
          setFilteredBuildings([]);
        })
        .finally(() => {
          setLoadingBuildings(false);
        });
    } else {
      setFilteredBuildings(buildings);
    }
  }, [complexId, buildings]);

  const handleNameInputChange = (value) => {
    setLocalName(value);
  };

  const handleNameInputKeyDown = (e) => {
    if (e.key === "Enter") {
      onApplyNameSearch?.(localName);
    }
  };

  const handleNameInputBlur = () => {
    onApplyNameSearch?.(localName);
  };

  const filterLabels = {
    total_floor: "Mərtəbə sayı",
    total_apartment: "Mənzil sayı",
  };

  const activeFilters = useMemo(() => {
    if (!search) return [];
    return Object.entries(search)
      .filter(([key, value]) => key !== 'name' && key !== 'status' && value && value.toString().trim())
      .map(([key, value]) => ({
        key,
        label: filterLabels[key] || key,
        value: value.toString().length > 30 ? value.toString().substring(0, 30) + '...' : value.toString(),
      }));
  }, [search]);

  const statusOptions = [
    { value: "", label: "Hamısı" },
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  const mtkOptions = useMemo(() => {
    return [
      { value: "", label: "Hamısı" },
      ...mtks.map((mtk) => ({
        value: String(mtk.id),
        label: mtk.name || `MTK #${mtk.id}`,
      })),
    ];
  }, [mtks]);

  const complexOptions = useMemo(() => {
    const complexesToShow = mtkId ? filteredComplexes : complexes;
    return [
      { value: "", label: "Hamısı" },
      ...complexesToShow.map((complex) => ({
        value: String(complex.id),
        label: complex.name || `Complex #${complex.id}`,
      })),
    ];
  }, [mtkId, filteredComplexes, complexes]);

  const buildingOptions = useMemo(() => {
    const buildingsToShow = complexId ? filteredBuildings : buildings;
    return [
      { value: "", label: "Hamısı" },
      ...buildingsToShow.map((building) => ({
        value: String(building.id),
        label: building.name || `Building #${building.id}`,
      })),
    ];
  }, [complexId, filteredBuildings, buildings]);

  // Cookie'den gelen değerler öncelikli (refresh'te kaybolmaz), yoksa URL'den gelen değerler
  // null veya undefined kontrolü yapıyoruz
  const displayMtkId = selectedMtkId !== null && selectedMtkId !== undefined ? selectedMtkId : (mtkId || null);
  const displayComplexId = selectedComplexId !== null && selectedComplexId !== undefined ? selectedComplexId : (complexId || null);
  const displayBuildingId = selectedBuildingId !== null && selectedBuildingId !== undefined ? selectedBuildingId : (buildingId || null);
  
  const itemsPerPageOptions = useMemo(() => {
    if (totalItems < 25) {
      return null;
    }

    const options = [];
    const maxItems = Math.min(totalItems, 100);
    
    options.push(20);
    
    STANDARD_OPTIONS.slice(1).forEach(option => {
      if (option <= maxItems && !options.includes(option)) {
        options.push(option);
      }
    });
    
    if (maxItems < 100 && !STANDARD_OPTIONS.includes(maxItems)) {
      const insertIndex = options.findIndex(opt => opt > maxItems);
      if (insertIndex === -1) {
        options.push(maxItems);
      } else {
        options.splice(insertIndex, 0, maxItems);
      }
    } else if (maxItems === 100 && !options.includes(100)) {
      options.push(100);
    }
    
    return options.map(value => ({
      id: value,
      name: String(value)
    }));
  }, [totalItems]);

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-3 sm:p-4 md:p-5 lg:p-6 relative z-10 overflow-visible">
      {/* Mobile Layout (< 768px) */}
      <div className="flex flex-col gap-3 sm:gap-4 md:hidden">
        {/* Search and Status Row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Input
            label="Axtarış (ada görə)"
            value={localName}
            onChange={(e) => handleNameInputChange(e.target.value)}
            onKeyDown={handleNameInputKeyDown}
            onBlur={handleNameInputBlur}
            className="flex-1 !bg-white/90 dark:!bg-gray-900/90"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <div className="w-full sm:w-[140px] flex-shrink-0 relative z-20 overflow-visible">
            <Select
              label="Status"
              value={search?.status || ""}
              onChange={(value) => onStatusChange?.(value)}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
              labelProps={{ className: "dark:text-gray-300" }}
            >
              {statusOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* MTK, Complex and Building Selects - grouped with less gap */}
        <div className="flex flex-col gap-2">
          <div className="w-full relative z-20 overflow-visible">
          <Select
            label="MTK"
            value={displayMtkId ? String(displayMtkId) : ""}
            onChange={(value) => {
              onMtkChange?.(value);
              if (value) {
                onComplexChange?.("");
                onBuildingChange?.("");
              }
            }}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
            labelProps={{ className: "dark:text-gray-300" }}
          >
            {mtkOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </div>

          <div className="w-full relative z-20 overflow-visible">
          <Select
            label="Complex"
            value={displayComplexId ? String(displayComplexId) : ""}
            onChange={(value) => {
              onComplexChange?.(value);
              if (value) {
                onBuildingChange?.("");
              }
            }}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
            labelProps={{ className: "dark:text-gray-300" }}
            disabled={loadingComplexes || (displayMtkId && filteredComplexes.length === 0)}
          >
            {complexOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </div>

          <div className="w-full relative z-20 overflow-visible">
          <Select
            label="Building"
            value={displayBuildingId ? String(displayBuildingId) : ""}
            onChange={(value) => onBuildingChange?.(value)}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
            labelProps={{ className: "dark:text-gray-300" }}
            disabled={loadingBuildings || (displayComplexId && filteredBuildings.length === 0)}
          >
            {buildingOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
          </div>
        </div>

        {itemsPerPageOptions && (
          <AppSelect
            items={itemsPerPageOptions}
            value={itemsPerPage}
            onChange={(value) => onItemsPerPageChange?.(value)}
            placeholder="Göstəriləcək say"
            allowAll={false}
          />
        )}

        {activeFilters.length > 0 && (
          <div className="flex flex-col gap-2">
            <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
              Aktiv filtrlər:
            </Typography>
            <div className="flex flex-wrap items-center gap-2">
              {activeFilters.map((filter) => (
                <Chip
                  key={filter.key}
                  value={`${filter.label}: ${filter.value}`}
                  onClose={() => onRemoveFilter?.(filter.key)}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow"
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            onClick={onSearchClick}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center"
            size="sm"
          >
            <MagnifyingGlassIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">Ətraflı axtarış</span>
          </Button>
          <Button
            type="button"
            onClick={onCreateClick}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center"
            size="sm"
          >
            <PlusIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">Blok əlavə et</span>
          </Button>
        </div>
      </div>

      {/* Tablet & Desktop Layout (>= 768px) */}
      <div className="hidden md:flex flex-col gap-3 lg:gap-4">
        {/* First Row: Search, Status, Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
          <div className="flex flex-col md:flex-row gap-3 flex-1 min-w-0">
            <div className="w-full md:w-[250px] lg:w-[300px] xl:w-[350px] flex-shrink-0">
              <Input
                label="Axtarış (ada görə)"
                value={localName}
                onChange={(e) => handleNameInputChange(e.target.value)}
                onKeyDown={handleNameInputKeyDown}
                onBlur={handleNameInputBlur}
                className="!bg-white/90 dark:!bg-gray-900/90"
                labelProps={{ className: "dark:text-gray-300" }}
              />
            </div>
            <div className="w-full md:w-[150px] lg:w-[160px] xl:w-[180px] flex-shrink-0 relative z-20 overflow-visible">
              <Select
                label="Status"
                value={search?.status || ""}
                onChange={(value) => onStatusChange?.(value)}
                className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
                labelProps={{ className: "dark:text-gray-300" }}
              >
                {statusOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0 md:ml-2 lg:ml-4">
                <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap hidden lg:block">
                  Aktiv filtrlər:
                </Typography>
                {activeFilters.map((filter) => (
                  <Chip
                    key={filter.key}
                    value={`${filter.label}: ${filter.value}`}
                    onClose={() => onRemoveFilter?.(filter.key)}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow"
                    size="sm"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Section: Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:flex-shrink-0">
            {itemsPerPageOptions && (
              <div className="w-full sm:w-[140px] lg:w-[150px] flex-shrink-0">
                <AppSelect
                  items={itemsPerPageOptions}
                  value={itemsPerPage}
                  onChange={(value) => onItemsPerPageChange?.(value)}
                  placeholder="Göstəriləcək say"
                  allowAll={false}
                />
              </div>
            )}

            <Button
              type="button"
              onClick={onSearchClick}
              className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all whitespace-nowrap w-full sm:w-auto px-4"
              size="md"
            >
              <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">Ətraflı axtarış</span>
            </Button>

            <Button
              type="button"
              onClick={onCreateClick}
              className="bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all whitespace-nowrap w-full sm:w-auto px-4"
              size="md"
            >
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base">Blok əlavə et</span>
            </Button>
          </div>
        </div>

        {/* Second Row: MTK, Complex and Building Selects */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-4 lg:gap-8">
          <div className="w-full md:w-[160px] lg:w-[170px] xl:w-[180px] flex-shrink-0 relative z-20 overflow-visible">
              <Select
                label="MTK"
                value={displayMtkId ? String(displayMtkId) : ""}
                onChange={(value) => {
                  onMtkChange?.(value);
                  if (value) {
                    onComplexChange?.("");
                    onBuildingChange?.("");
                  }
                }}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
                labelProps={{ className: "dark:text-gray-300" }}
              >
                {mtkOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
          <div className="w-full md:w-[160px] lg:w-[170px] xl:w-[180px] flex-shrink-0 relative z-20 overflow-visible">
              <Select
                label="Complex"
                value={displayComplexId ? String(displayComplexId) : ""}
                onChange={(value) => {
                  onComplexChange?.(value);
                  if (value) {
                    onBuildingChange?.("");
                  }
                }}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
                labelProps={{ className: "dark:text-gray-300" }}
                disabled={loadingComplexes || (displayMtkId && filteredComplexes.length === 0)}
              >
                {complexOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
          <div className="w-full md:w-[160px] lg:w-[170px] xl:w-[180px] flex-shrink-0 relative z-20 overflow-visible">
              <Select
                label="Building"
                value={displayBuildingId ? String(displayBuildingId) : ""}
                onChange={(value) => onBuildingChange?.(value)}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
                labelProps={{ className: "dark:text-gray-300" }}
                disabled={loadingBuildings || (displayComplexId && filteredBuildings.length === 0)}
              >
                {buildingOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
