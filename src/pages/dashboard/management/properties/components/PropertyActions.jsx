import React, { useMemo, useState, useEffect } from "react";
import { Button, Input, Select, Option, Chip, Typography } from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AppSelect from "@/components/ui/AppSelect";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { loadMtks } from "@/store/slices/mtkSlice";
import { loadComplexes } from "@/store/slices/complexSlice";
import { loadBuildings } from "@/store/slices/buildingSlice";
import { loadBlocks } from "@/store/slices/blockSlice";
import propertyLookupsAPI from "../api/lookups";

const STANDARD_OPTIONS = [10, 20, 50, 75, 100];

export function PropertyActions({ 
  search = {}, 
  mtkId = null,
  complexId = null,
  buildingId = null,
  blockId = null,
  onCreateClick, 
  onSearchClick,
  onNameSearchChange,
  onStatusChange,
  onMtkChange,
  onComplexChange,
  onBuildingChange,
  onBlockChange,
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
  const blocks = useAppSelector((state) => state.block.blocks);
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const selectedBlockId = useAppSelector((state) => state.block.selectedBlockId);
  
  const [localName, setLocalName] = useState(search?.name || "");
  const [filteredComplexes, setFilteredComplexes] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

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
    if (blocks.length === 0) {
      dispatch(loadBlocks({ page: 1, per_page: 1000 }));
    }
  }, [dispatch, blocks.length]);

  useEffect(() => {
    if (mtkId) {
      setLoadingComplexes(true);
      propertyLookupsAPI.getComplexes({ mtk_id: mtkId })
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
      propertyLookupsAPI.getBuildings({ complex_id: complexId })
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

  useEffect(() => {
    if (buildingId) {
      setLoadingBlocks(true);
      propertyLookupsAPI.getBlocks({ building_id: buildingId })
        .then((data) => {
          setFilteredBlocks(data || []);
        })
        .catch((error) => {
          console.error("Error loading blocks:", error);
          setFilteredBlocks([]);
        })
        .finally(() => {
          setLoadingBlocks(false);
        });
    } else {
      setFilteredBlocks(blocks);
    }
  }, [buildingId, blocks]);

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
    property_type: "Mənzil tipi",
    area: "Sahə",
    floor: "Mərtəbə",
    apartment_number: "Mənzil №",
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

  const blockOptions = useMemo(() => {
    const blocksToShow = buildingId ? filteredBlocks : blocks;
    return [
      { value: "", label: "Hamısı" },
      ...blocksToShow.map((block) => ({
        value: String(block.id),
        label: block.name || `Block #${block.id}`,
      })),
    ];
  }, [buildingId, filteredBlocks, blocks]);

  const displayMtkId = mtkId || selectedMtkId;
  const displayComplexId = complexId || selectedComplexId;
  const displayBuildingId = buildingId || selectedBuildingId;
  const displayBlockId = blockId || selectedBlockId;
  
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
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 space-y-5">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex gap-3">
          <Input
            label="Axtarış (ada görə)"
            value={localName}
            onChange={(e) => handleNameInputChange(e.target.value)}
            onKeyDown={handleNameInputKeyDown}
            onBlur={handleNameInputBlur}
            className="flex-1 !bg-white/90 dark:!bg-gray-900/90"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <div className="w-[140px]">
            <Select
              label="Status"
              value={search?.status || ""}
              onChange={(value) => onStatusChange?.(value)}
              className="!bg-white/90 dark:!bg-gray-900/90"
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

        <div className="w-full">
          <Select
            label="MTK"
            value={displayMtkId ? String(displayMtkId) : ""}
            onChange={(value) => {
              onMtkChange?.(value);
              if (value) {
                onComplexChange?.("");
                onBuildingChange?.("");
                onBlockChange?.("");
              }
            }}
            className="!bg-white/90 dark:!bg-gray-900/90"
            labelProps={{ className: "dark:text-gray-300" }}
          >
            {mtkOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </div>

        <div className="w-full">
          <Select
            label="Complex"
            value={displayComplexId ? String(displayComplexId) : ""}
            onChange={(value) => {
              onComplexChange?.(value);
              if (value) {
                onBuildingChange?.("");
                onBlockChange?.("");
              }
            }}
            className="!bg-white/90 dark:!bg-gray-900/90"
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

        <div className="w-full">
          <Select
            label="Building"
            value={displayBuildingId ? String(displayBuildingId) : ""}
            onChange={(value) => {
              onBuildingChange?.(value);
              if (value) {
                onBlockChange?.("");
              }
            }}
            className="!bg-white/90 dark:!bg-gray-900/90"
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

        <div className="w-full">
          <Select
            label="Block"
            value={displayBlockId ? String(displayBlockId) : ""}
            onChange={(value) => onBlockChange?.(value)}
            className="!bg-white/90 dark:!bg-gray-900/90"
            labelProps={{ className: "dark:text-gray-300" }}
            disabled={loadingBlocks || (displayBuildingId && filteredBlocks.length === 0)}
          >
            {blockOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
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
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow"
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={onSearchClick}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            size="md"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Ətraflı axtarış
          </Button>
          <Button
            onClick={onCreateClick}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all"
            size="md"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Mənzil əlavə et
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col lg:flex-row gap-3 flex-1 min-w-0">
            <div className="w-full lg:w-[280px] xl:w-[320px] flex-shrink-0">
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
            <div className="w-full lg:w-[140px] flex-shrink-0">
              <Select
                label="Status"
                value={search?.status || ""}
                onChange={(value) => onStatusChange?.(value)}
                className="!bg-white/90 dark:!bg-gray-900/90"
                labelProps={{ className: "dark:text-gray-300" }}
              >
                {statusOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="w-full lg:w-[140px] flex-shrink-0">
              <Select
                label="MTK"
                value={displayMtkId ? String(displayMtkId) : ""}
                onChange={(value) => {
                  onMtkChange?.(value);
                  if (value) {
                    onComplexChange?.("");
                    onBuildingChange?.("");
                    onBlockChange?.("");
                  }
                }}
                className="!bg-white/90 dark:!bg-gray-900/90"
                labelProps={{ className: "dark:text-gray-300" }}
              >
                {mtkOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="w-full lg:w-[140px] flex-shrink-0">
              <Select
                label="Complex"
                value={displayComplexId ? String(displayComplexId) : ""}
                onChange={(value) => {
                  onComplexChange?.(value);
                  if (value) {
                    onBuildingChange?.("");
                    onBlockChange?.("");
                  }
                }}
                className="!bg-white/90 dark:!bg-gray-900/90"
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
            <div className="w-full lg:w-[140px] flex-shrink-0">
              <Select
                label="Building"
                value={displayBuildingId ? String(displayBuildingId) : ""}
                onChange={(value) => {
                  onBuildingChange?.(value);
                  if (value) {
                    onBlockChange?.("");
                  }
                }}
                className="!bg-white/90 dark:!bg-gray-900/90"
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
            <div className="w-full lg:w-[140px] flex-shrink-0">
              <Select
                label="Block"
                value={displayBlockId ? String(displayBlockId) : ""}
                onChange={(value) => onBlockChange?.(value)}
                className="!bg-white/90 dark:!bg-gray-900/90"
                labelProps={{ className: "dark:text-gray-300" }}
                disabled={loadingBlocks || (displayBuildingId && filteredBlocks.length === 0)}
              >
                {blockOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0 lg:ml-4">
                <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">
                  Aktiv filtrlər:
                </Typography>
                {activeFilters.map((filter) => (
                  <Chip
                    key={filter.key}
                    value={`${filter.label}: ${filter.value}`}
                    onClose={() => onRemoveFilter?.(filter.key)}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow"
                    size="sm"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:flex-shrink-0">
            {itemsPerPageOptions && (
              <div className="w-full sm:w-[150px] flex-shrink-0">
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
              onClick={onSearchClick}
              className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all whitespace-nowrap"
              size="md"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Ətraflı axtarış
            </Button>

            <Button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all whitespace-nowrap"
              size="md"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Mənzil əlavə et
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
