import React, { useMemo, useState, useEffect } from "react";
import { Button, Input, Select, Option, Chip, Typography } from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AppSelect from "@/components/ui/AppSelect";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { loadMtks } from "@/store/slices/mtkSlice";
import { loadComplexes } from "@/store/slices/complexSlice";
import { loadBuildings } from "@/store/slices/buildingSlice";
import { loadBlocks } from "@/store/slices/blockSlice";
import { loadProperties } from "@/store/slices/propertySlice";
import propertyLookupsAPI from "../../properties/api/lookups";

const STANDARD_OPTIONS = [10, 20, 50, 75, 100];

export function ResidentActions({ 
  search = {}, 
  mtkId = null,
  complexId = null,
  buildingId = null,
  blockId = null,
  propertyId = null,
  onCreateClick, 
  onSearchClick,
  onNameSearchChange,
  onStatusChange,
  onMtkChange,
  onComplexChange,
  onBuildingChange,
  onBlockChange,
  onPropertyChange,
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
  const properties = useAppSelector((state) => state.property.properties);
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const selectedBlockId = useAppSelector((state) => state.block.selectedBlockId);
  const selectedPropertyId = useAppSelector((state) => state.property.selectedPropertyId);
  
  const displayMtkId = selectedMtkId !== null && selectedMtkId !== undefined ? selectedMtkId : (mtkId || null);
  const displayComplexId = selectedComplexId !== null && selectedComplexId !== undefined ? selectedComplexId : (complexId || null);
  const displayBuildingId = selectedBuildingId !== null && selectedBuildingId !== undefined ? selectedBuildingId : (buildingId || null);
  const displayBlockId = selectedBlockId !== null && selectedBlockId !== undefined ? selectedBlockId : (blockId || null);
  const displayPropertyId = selectedPropertyId !== null && selectedPropertyId !== undefined ? selectedPropertyId : (propertyId || null);
  
  const [localName, setLocalName] = useState(search?.name || "");
  const [filteredComplexes, setFilteredComplexes] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);

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
    if (properties.length === 0) {
      dispatch(loadProperties({ page: 1, per_page: 1000 }));
    }
  }, [dispatch, properties.length]);

  useEffect(() => {
    if (displayMtkId) {
      setLoadingComplexes(true);
      propertyLookupsAPI.getComplexes({ mtk_id: displayMtkId })
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
  }, [displayMtkId, complexes]);

  useEffect(() => {
    if (displayComplexId) {
      setLoadingBuildings(true);
      propertyLookupsAPI.getBuildings({ complex_id: displayComplexId })
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
  }, [displayComplexId, buildings]);

  useEffect(() => {
    if (displayBuildingId) {
      setLoadingBlocks(true);
      propertyLookupsAPI.getBlocks({ building_id: displayBuildingId })
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
  }, [displayBuildingId, blocks]);

  useEffect(() => {
    if (displayBlockId) {
      setLoadingProperties(true);
      // Block'a ait property'leri almak için API'den çek veya properties listesini filtrele
      propertyLookupsAPI.getBlocks({ block_id: displayBlockId })
        .then(() => {
          // Block'a ait property'leri almak için properties listesini filtrele
          const blockProperties = properties.filter((prop) => {
            const propBlockId = prop.block_id || prop.sub_data?.block?.id;
            return propBlockId === parseInt(displayBlockId);
          });
          setFilteredProperties(blockProperties);
        })
        .catch((error) => {
          console.error("Error loading properties:", error);
          // Hata durumunda da properties listesini filtrele
          const blockProperties = properties.filter((prop) => {
            const propBlockId = prop.block_id || prop.sub_data?.block?.id;
            return propBlockId === parseInt(displayBlockId);
          });
          setFilteredProperties(blockProperties);
        })
        .finally(() => {
          setLoadingProperties(false);
        });
    } else {
      setFilteredProperties(properties);
    }
  }, [displayBlockId, properties]);

  useEffect(() => {
    setLocalName(search?.name || "");
  }, [search?.name]);

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
    surname: "Soyad",
    email: "E-mail",
    phone: "Telefon",
    type: "Tip",
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
    const complexesToUse = filteredComplexes.length > 0 ? filteredComplexes : complexes;
    return [
      { value: "", label: "Hamısı" },
      ...complexesToUse.map((complex) => ({
        value: String(complex.id),
        label: complex.name || `Complex #${complex.id}`,
      })),
    ];
  }, [filteredComplexes, complexes]);

  const buildingOptions = useMemo(() => {
    const buildingsToUse = filteredBuildings.length > 0 ? filteredBuildings : buildings;
    return [
      { value: "", label: "Hamısı" },
      ...buildingsToUse.map((building) => ({
        value: String(building.id),
        label: building.name || `Building #${building.id}`,
      })),
    ];
  }, [filteredBuildings, buildings]);

  const blockOptions = useMemo(() => {
    const blocksToUse = filteredBlocks.length > 0 ? filteredBlocks : blocks;
    return [
      { value: "", label: "Hamısı" },
      ...blocksToUse.map((block) => ({
        value: String(block.id),
        label: block.name || `Block #${block.id}`,
      })),
    ];
  }, [filteredBlocks, blocks]);

  const propertyOptions = useMemo(() => {
    const propertiesToUse = filteredProperties.length > 0 ? filteredProperties : properties;
    return [
      { value: "", label: "Hamısı" },
      ...propertiesToUse.map((property) => ({
        value: String(property.id),
        label: property.name || `Property #${property.id}`,
      })),
    ];
  }, [filteredProperties, properties]);
  
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

        {/* MTK, Kompleks, Bina, Blok, Mənzil Selects */}
        <div className="flex flex-col gap-3">
          <div className="w-full relative z-20 overflow-visible">
            <Select
              label="MTK"
              value={displayMtkId ? String(displayMtkId) : ""}
              onChange={(value) => {
                onMtkChange?.(value);
                if (value) {
                  onComplexChange?.("");
                  onBuildingChange?.("");
                  onBlockChange?.("");
                  onPropertyChange?.("");
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
              label="Kompleks"
              value={displayComplexId ? String(displayComplexId) : ""}
              onChange={(value) => {
                onComplexChange?.(value);
                if (value) {
                  onBuildingChange?.("");
                  onBlockChange?.("");
                  onPropertyChange?.("");
                }
              }}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
              labelProps={{ className: "dark:text-gray-300" }}
              disabled={!displayMtkId}
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
              label="Bina"
              value={displayBuildingId ? String(displayBuildingId) : ""}
              onChange={(value) => {
                onBuildingChange?.(value);
                if (value) {
                  onBlockChange?.("");
                  onPropertyChange?.("");
                }
              }}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
              labelProps={{ className: "dark:text-gray-300" }}
              disabled={!displayComplexId}
            >
              {buildingOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-full relative z-20 overflow-visible">
            <Select
              label="Blok"
              value={displayBlockId ? String(displayBlockId) : ""}
              onChange={(value) => {
                onBlockChange?.(value);
                if (value) {
                  onPropertyChange?.("");
                }
              }}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
              labelProps={{ className: "dark:text-gray-300" }}
              disabled={!displayBuildingId}
            >
              {blockOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-full relative z-20 overflow-visible">
            <Select
              label="Mənzil"
              value={displayPropertyId ? String(displayPropertyId) : ""}
              onChange={(value) => onPropertyChange?.(value)}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
              labelProps={{ className: "dark:text-gray-300" }}
              disabled={!displayBlockId}
            >
              {propertyOptions.map((opt) => (
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
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow"
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
            <span className="text-sm">Sakin əlavə et</span>
          </Button>
        </div>
      </div>

      {/* Tablet & Desktop Layout (>= 768px) */}
      <div className="hidden md:flex flex-col gap-3 lg:gap-4">
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
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow"
                    size="sm"
                  />
                ))}
              </div>
            )}
          </div>

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
              <span className="text-sm sm:text-base">Sakin əlavə et</span>
            </Button>
          </div>
        </div>

        {/* Second Row: MTK, Kompleks, Bina, Blok, Mənzil Selects */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-4 lg:gap-8">
          <div className="w-full md:w-[180px] lg:w-[200px] xl:w-[220px] flex-shrink-0 relative z-20 overflow-visible">
            <Select
              label="MTK"
              value={displayMtkId ? String(displayMtkId) : ""}
              onChange={(value) => {
                onMtkChange?.(value);
                if (value) {
                  onComplexChange?.("");
                  onBuildingChange?.("");
                  onBlockChange?.("");
                  onPropertyChange?.("");
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
          <div className="w-full md:w-[180px] lg:w-[200px] xl:w-[220px] flex-shrink-0 relative z-20 overflow-visible">
            <Select
              label="Kompleks"
              value={displayComplexId ? String(displayComplexId) : ""}
              onChange={(value) => {
                onComplexChange?.(value);
                if (value) {
                  onBuildingChange?.("");
                  onBlockChange?.("");
                  onPropertyChange?.("");
                }
              }}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
              labelProps={{ className: "dark:text-gray-300" }}
              disabled={!displayMtkId}
            >
              {complexOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-full md:w-[180px] lg:w-[200px] xl:w-[220px] flex-shrink-0 relative z-20 overflow-visible">
            <Select
              label="Bina"
              value={displayBuildingId ? String(displayBuildingId) : ""}
              onChange={(value) => {
                onBuildingChange?.(value);
                if (value) {
                  onBlockChange?.("");
                  onPropertyChange?.("");
                }
              }}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
              labelProps={{ className: "dark:text-gray-300" }}
              disabled={!displayComplexId}
            >
              {buildingOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-full md:w-[180px] lg:w-[200px] xl:w-[220px] flex-shrink-0 relative z-20 overflow-visible">
            <Select
              label="Blok"
              value={displayBlockId ? String(displayBlockId) : ""}
              onChange={(value) => {
                onBlockChange?.(value);
                if (value) {
                  onPropertyChange?.("");
                }
              }}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
              labelProps={{ className: "dark:text-gray-300" }}
              disabled={!displayBuildingId}
            >
              {blockOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-full md:w-[180px] lg:w-[200px] xl:w-[220px] flex-shrink-0 relative z-20 overflow-visible">
            <Select
              label="Mənzil"
              value={displayPropertyId ? String(displayPropertyId) : ""}
              onChange={(value) => onPropertyChange?.(value)}
              className="!bg-white/90 dark:!bg-gray-900/90 [&>div>div]:!z-[9999]"
              labelProps={{ className: "dark:text-gray-300" }}
              disabled={!displayBlockId}
            >
              {propertyOptions.map((opt) => (
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

