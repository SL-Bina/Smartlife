import React, { useMemo, useState, useEffect } from "react";
import { Button, Chip, Typography } from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { AsyncSearchSelect } from "@/components/ui/AsyncSearchSelect";
import AppSelect from "@/components/ui/AppSelect";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setSelectedMtk, loadMtkById } from "@/store/slices/mtkSlice";
import { setSelectedComplex, loadComplexById } from "@/store/slices/complexSlice";
import { setSelectedBuilding, loadBuildingById } from "@/store/slices/buildingSlice";
import { setSelectedBlock, loadBlockById } from "@/store/slices/blockSlice";
import { setSelectedProperty, loadPropertyById } from "@/store/slices/propertySlice";
import api from "@/services/api";

// localStorage keys for persisting filter selections
const STORAGE_KEYS = {
  MTK: 'selected_mtk_id',
  COMPLEX: 'selected_complex_id', 
  BUILDING: 'selected_building_id',
  BLOCK: 'selected_block_id',
  PROPERTY: 'selected_property_id',
};

// Load saved selections from localStorage on mount
const loadSavedSelections = () => {
  const saved = {};
  Object.values(STORAGE_KEYS).forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      const entityKey = Object.keys(STORAGE_KEYS).find(k => STORAGE_KEYS[k] === key);
      saved[entityKey.toLowerCase()] = parseInt(value);
    }
  });
  return saved;
};

// Save selection to localStorage
const saveSelection = (entityType, id) => {
  const storageKey = STORAGE_KEYS[entityType.toUpperCase()];
  if (id) {
    localStorage.setItem(storageKey, id.toString());
  } else {
    localStorage.removeItem(storageKey);
  }
};

const STANDARD_OPTIONS = [10, 20, 50, 75, 100];

export const ENTITY_LEVELS = {
  MTK: "mtk",
  COMPLEX: "complex",
  BUILDING: "building",
  BLOCK: "block",
  PROPERTY: "property",
  RESIDENT: "resident",
  INVOICE: "invoice",
};

const LEVEL_CONFIG = {
  [ENTITY_LEVELS.MTK]: {
    filters: [],
    label: "MTK",
    addButtonText: "MTK əlavə et",
    gradientColors: "from-red-500 to-red-600",
  },
  [ENTITY_LEVELS.COMPLEX]: {
    filters: ["mtk"],
    label: "Complex",
    addButtonText: "Complex əlavə et",
    gradientColors: "from-blue-500 to-blue-600",
  },
  [ENTITY_LEVELS.BUILDING]: {
    filters: ["mtk", "complex"],
    label: "Bina",
    addButtonText: "Bina əlavə et",
    gradientColors: "from-purple-500 to-purple-600",
  },
  [ENTITY_LEVELS.BLOCK]: {
    filters: ["mtk", "complex", "building"],
    label: "Blok",
    addButtonText: "Blok əlavə et",
    gradientColors: "from-indigo-500 to-indigo-600",
  },
  [ENTITY_LEVELS.PROPERTY]: {
    filters: ["mtk", "complex", "building", "block"],
    label: "Mənzil",
    addButtonText: "Mənzil əlavə et",
    gradientColors: "from-teal-500 to-teal-600",
  },
  [ENTITY_LEVELS.RESIDENT]: {
    filters: ["mtk", "complex", "building", "block", "property"],
    label: "Sakin",
    addButtonText: "Sakin əlavə et",
    gradientColors: "from-orange-500 to-orange-600",
  },
  [ENTITY_LEVELS.INVOICE]: {
    filters: [],
    label: "Faktura",
    addButtonText: "Faktura əlavə et",
    gradientColors: "from-green-500 to-green-600",
  },
};

const FILTER_CONFIG = {
  mtk: {
    label: "MTK",
    key: "mtkId",
    endpoint: "/search/module/mtk",
  },
  complex: {
    label: "Complex",
    key: "complexId",
    endpoint: "/search/module/complex",
    parentParam: "mtk_id",
  },
  building: {
    label: "Bina",
    key: "buildingId",
    endpoint: "/search/module/building",
    parentParam: "complex_id",
  },
  block: {
    label: "Blok",
    key: "blockId",
    endpoint: "/search/module/block",
    parentParam: "building_id",
  },
  property: {
    label: "Mənzil",
    key: "propertyId",
    endpoint: "/search/module/property",
    parentParam: "block_id",
  },
};

export function ManagementActions({
  entityLevel,
  search = {},
  onApplyNameSearch,
  onStatusChange,
  onRemoveFilter,
  onCreateClick,
  onSearchClick,
  totalItems = 0,
  itemsPerPage = 20,
  onItemsPerPageChange,
  customFilterLabels = {},
}) {
  const config = LEVEL_CONFIG[entityLevel];

  const [savedSelections, setSavedSelections] = useState({});

  const applySaved = async (filterType, savedValue) => {
    if (savedValue && !getFilterValue(filterType)) {
      await handleFilterChange(filterType, savedValue, { value: savedValue, label: '' });
    }
  };

  useEffect(() => {
    const saved = loadSavedSelections();
    setSavedSelections(saved);

    Object.entries(saved).forEach(([key, value]) => {
      applySaved(key, value);
    });
  }, []); 

  const mtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const complexId = useAppSelector((state) => state.complex.selectedComplexId);
  const buildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const blockId = useAppSelector((state) => state.block.selectedBlockId);
  const propertyId = useAppSelector((state) => state.property.selectedPropertyId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);
  const selectedBuilding = useAppSelector((state) => state.building.selectedBuilding);
  const selectedBlock = useAppSelector((state) => state.block.selectedBlock);
  const selectedProperty = useAppSelector((state) => state.property.selectedProperty);
  const dispatch = useAppDispatch();
  const [selectedLabels, setSelectedLabels] = useState({});
  const [localName, setLocalName] = useState(search?.name || "");

  useEffect(() => {
    const labels = {};
    if (selectedMtk?.name) labels.mtk = selectedMtk.name;
    if (selectedComplex?.name) labels.complex = selectedComplex.name;
    if (selectedBuilding?.name) labels.building = selectedBuilding.name;
    if (selectedBlock?.name) labels.block = selectedBlock.name;
    if (selectedProperty?.name || selectedProperty?.apartment_number) {
      labels.property = selectedProperty.name || selectedProperty.apartment_number;
    }
    setSelectedLabels(prev => ({ ...prev, ...labels }));
  }, [selectedMtk, selectedComplex, selectedBuilding, selectedBlock, selectedProperty]);

  useEffect(() => {
    const ensureValues = async () => {
      for (const filterType of config.filters) {
        if (isFilterDisabled(filterType)) continue;

        const currentVal = getFilterValue(filterType);
        if (currentVal) continue; 

        const saved = savedSelections[filterType];
        if (saved) {
          await applySaved(filterType, saved);
        } else {
          await handleAutoSelectFirst(filterType);
        }
      }
    };

    ensureValues();
  }, [entityLevel, config.filters, savedSelections]);


  const handleAutoSelectFirst = async (filterType) => {
    try {
      const filterConfig = FILTER_CONFIG[filterType];
      const params = getParentSearchParams(filterType);
      // enforce a single result
      params.per_page = 1;

      const response = await api.get(`${filterConfig.endpoint}`, { params });
      const firstItem = response?.data?.data?.data?.[0];
      if (firstItem) {
        await handleFilterChange(filterType, firstItem.id, { value: firstItem.id, label: firstItem.name });
      }
    } catch (error) {
      console.error(`Error auto-selecting first ${filterType}:`, error);
    }
  };

  // Refresh all filters
  const handleRefreshFilters = async () => {
    try {
      // Clear all selections from Redux
      dispatch(setSelectedMtk({ id: null, mtk: null }));
      dispatch(setSelectedComplex({ id: null, complex: null }));
      dispatch(setSelectedBuilding({ id: null, building: null }));
      dispatch(setSelectedBlock({ id: null, block: null }));
      dispatch(setSelectedProperty({ id: null, property: null }));
      
      // Clear all selections from localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Auto-select first options after a short delay
      if (config.filters.includes('mtk')) {
        setTimeout(() => handleAutoSelectFirst('mtk'), 100);
      }
      if (config.filters.includes('complex')) {
        setTimeout(() => handleAutoSelectFirst('complex'), 200);
      }
      if (config.filters.includes('building')) {
        setTimeout(() => handleAutoSelectFirst('building'), 300);
      }
      if (config.filters.includes('block')) {
        setTimeout(() => handleAutoSelectFirst('block'), 400);
      }
      if (config.filters.includes('property')) {
        setTimeout(() => handleAutoSelectFirst('property'), 500);
      }
    } catch (error) {
      console.error('Error refreshing filters:', error);
    }
  };

  useEffect(() => {
    setLocalName(search?.name || "");
  }, [search?.name]);

  const getFilterValue = (filterType) => {
    switch (filterType) {
      case "mtk":
        return mtkId;
      case "complex":
        return complexId;
      case "building":
        return buildingId;
      case "block":
        return blockId;
      case "property":
        return propertyId;
      default:
        return null;
    }
  };

  // Get parent filter value for API params (ARRAY FORMAT for backend)
  // Send all relevant parent filters for proper filtering
  const getParentSearchParams = (filterType) => {
    const params = {};

    const mtkVal = getFilterValue("mtk");
    const complexVal = getFilterValue("complex");
    const buildingVal = getFilterValue("building");
    const blockVal = getFilterValue("block");

    switch (filterType) {
      case "complex":
        if (mtkVal) {
          params.mtk_ids = [mtkVal];
        }
        break;

      case "building":
        // Send both mtk_ids and complex_ids for proper filtering
        if (mtkVal) {
          params.mtk_ids = [mtkVal];
        }
        if (complexVal) {
          params.complex_ids = [complexVal];
        }
        break;

      case "block":
        // Send mtk_ids, complex_ids, and building_ids for proper filtering
        if (mtkVal) {
          params.mtk_ids = [mtkVal];
        }
        if (complexVal) {
          params.complex_ids = [complexVal];
        }
        if (buildingVal) {
          params.building_ids = [buildingVal];
        }
        break;

      case "property":
        // Send all parent filters for proper filtering
        if (mtkVal) {
          params.mtk_ids = [mtkVal];
        }
        if (complexVal) {
          params.complex_ids = [complexVal];
        }
        if (buildingVal) {
          params.building_ids = [buildingVal];
        }
        if (blockVal) {
          params.block_ids = [blockVal];
        }
        break;

      case "resident":
        // Send all parent filters for proper filtering
        if (mtkVal) {
          params.mtk_ids = [mtkVal];
        }
        if (complexVal) {
          params.complex_ids = [complexVal];
        }
        break;

      default:
        break;
    }

    return params;
  };

  const handleFilterChange = async (filterType, numValue, selectedOption) => {
    // Save to localStorage
    saveSelection(filterType, numValue);
    
    const filterIndex = config.filters.indexOf(filterType);
    const filtersToReset = config.filters.slice(filterIndex + 1);

    // Store selected label for display
    if (selectedOption && numValue) {
      setSelectedLabels(prev => ({
        ...prev,
        [filterType]: selectedOption.name || selectedOption.apartment_number || `#${numValue}`
      }));
    } else {
      setSelectedLabels(prev => {
        const newLabels = { ...prev };
        delete newLabels[filterType];
        // Also clear child filter labels
        filtersToReset.forEach(f => delete newLabels[f]);
        return newLabels;
      });
    }

    // Update Redux state directly
    const value = numValue ? parseInt(numValue, 10) : null;
    
    switch (filterType) {
      case "mtk":
        if (value) {
          const result = await dispatch(loadMtkById(value));
          if (result.payload) {
            dispatch(setSelectedMtk({ id: value, mtk: result.payload }));
          }
        } else {
          dispatch(setSelectedMtk({ id: null, mtk: null }));
        }
        // Clear dependent filters and auto-fill the immediate child
        if (filtersToReset.includes("complex")) {
          dispatch(setSelectedComplex({ id: null, complex: null }));
        }
        if (filtersToReset.includes("building")) dispatch(setSelectedBuilding({ id: null, building: null }));
        if (filtersToReset.includes("block")) dispatch(setSelectedBlock({ id: null, block: null }));
        if (filtersToReset.includes("property")) dispatch(setSelectedProperty({ id: null, property: null }));
        // after clearing, try autofilling next filter
        if (filtersToReset.length && value) {
          await handleAutoSelectFirst(filtersToReset[0]);
        }
        break;

      case "complex":
        if (numValue) {
          const result = await dispatch(loadComplexById(numValue));
          if (result.payload) {
            dispatch(setSelectedComplex({ id: numValue, complex: result.payload }));
          }
        } else {
          dispatch(setSelectedComplex({ id: null, complex: null }));
        }
        // Clear dependent filters
        if (filtersToReset.includes("building")) dispatch(setSelectedBuilding({ id: null, building: null }));
        if (filtersToReset.includes("block")) dispatch(setSelectedBlock({ id: null, block: null }));
        if (filtersToReset.includes("property")) dispatch(setSelectedProperty({ id: null, property: null }));
        if (filtersToReset.length && numValue) {
          await handleAutoSelectFirst(filtersToReset[0]);
        }
        break;

      case "building":
        if (numValue) {
          const result = await dispatch(loadBuildingById(numValue));
          if (result.payload) {
            dispatch(setSelectedBuilding({ id: numValue, building: result.payload }));
          }
        } else {
          dispatch(setSelectedBuilding({ id: null, building: null }));
        }
        // Clear dependent filters
        if (filtersToReset.includes("block")) dispatch(setSelectedBlock({ id: null, block: null }));
        if (filtersToReset.includes("property")) dispatch(setSelectedProperty({ id: null, property: null }));
        if (filtersToReset.length && numValue) {
          await handleAutoSelectFirst(filtersToReset[0]);
        }
        break;

      case "block":
        if (numValue) {
          const result = await dispatch(loadBlockById(numValue));
          if (result.payload) {
            dispatch(setSelectedBlock({ id: numValue, block: result.payload }));
          }
        } else {
          dispatch(setSelectedBlock({ id: null, block: null }));
        }
        // Clear dependent filters
        if (filtersToReset.includes("property")) dispatch(setSelectedProperty({ id: null, property: null }));
        if (filtersToReset.length && numValue) {
          await handleAutoSelectFirst(filtersToReset[0]);
        }
        break;

      case "property":
        if (numValue) {
          const result = await dispatch(loadPropertyById(numValue));
          if (result.payload) {
            dispatch(setSelectedProperty({ id: numValue, property: result.payload }));
          }
        } else {
          dispatch(setSelectedProperty({ id: null, property: null }));
        }
        break;

      default:
        break;
    }
  };

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

  const activeFilters = useMemo(() => {
    if (!search) return [];
    const defaultLabels = {
      phone: "Telefon",
      email: "E-mail",
      website: "Website",
      desc: "Təsvir",
      total_floor: "Mərtəbə sayı",
      total_apartment: "Mənzil sayı",
      area: "Sahə",
      floor: "Mərtəbə",
      apartment_number: "Mənzil №",
      surname: "Soyad",
      type: "Tip",
    };
    const labels = { ...defaultLabels, ...customFilterLabels };

    return Object.entries(search)
      .filter(([key, value]) => key !== "name" && key !== "status" && value && value.toString().trim())
      .map(([key, value]) => ({
        key,
        label: labels[key] || key,
        value: value.toString().length > 30 ? value.toString().substring(0, 30) + "..." : value.toString(),
      }));
  }, [search, customFilterLabels]);

  const getStatusOptions = () => {
    if (entityLevel === ENTITY_LEVELS.INVOICE) {
      return [
        { value: "", label: "Hamısı" },
        { value: "paid", label: "Ödənilib" },
        { value: "not_paid", label: "Ödənilməmiş" },
        { value: "pending", label: "Gözləyir" },
        { value: "overdue", label: "Gecikmiş" },
        { value: "declined", label: "Rədd edilib" },
        { value: "draft", label: "Qaralama" },
        { value: "pre_paid", label: "Ön ödəniş" },
      ];
    }
    return [
      { value: "", label: "Hamısı" },
      { value: "active", label: "Aktiv" },
      { value: "inactive", label: "Qeyri-aktiv" },
    ];
  };

  const statusOptions = getStatusOptions();

  const itemsPerPageOptions = useMemo(() => {
    if (totalItems < 25) {
      return null;
    }

    const options = [];
    const maxItems = Math.min(totalItems, 100);

    options.push(20);

    STANDARD_OPTIONS.slice(1).forEach((option) => {
      if (option <= maxItems && !options.includes(option)) {
        options.push(option);
      }
    });

    if (maxItems < 100 && !STANDARD_OPTIONS.includes(maxItems)) {
      const insertIndex = options.findIndex((opt) => opt > maxItems);
      if (insertIndex === -1) {
        options.push(maxItems);
      } else {
        options.splice(insertIndex, 0, maxItems);
      }
    } else if (maxItems === 100 && !options.includes(100)) {
      options.push(100);
    }

    return options.map((value) => ({
      id: value,
      name: String(value),
    }));
  }, [totalItems]);

  const hasFilters = config.filters.length > 0;

  // Check if filter should be disabled based on parent selection
  const isFilterDisabled = (filterType) => {
    const filterIndex = config.filters.indexOf(filterType);
    if (filterIndex <= 0) return false;

    const parentFilter = config.filters[filterIndex - 1];
    const parentValue = getFilterValue(parentFilter);
    return !parentValue;
  };

  const renderFilterSelect = (filterType, isMobile = false) => {
    const filterConfig = FILTER_CONFIG[filterType];
    const value = getFilterValue(filterType);
    const label = customFilterLabels[filterType] || filterConfig.label;
    const disabled = isFilterDisabled(filterType);
    const searchParams = getParentSearchParams(filterType);
    
    // Create unique key based on parent filter values to force re-render when parents change
    const parentFilters = [];
    const filterIndex = config.filters.indexOf(filterType);
    if (filterIndex > 0) {
      config.filters.slice(0, filterIndex).forEach(parentFilter => {
        parentFilters.push(getFilterValue(parentFilter) || 'null');
      });
    }
    const selectKey = `${filterType}-${parentFilters.join('-')}`;

    return (
      <div
        key={filterType}
        className={isMobile ? "w-full" : "w-full md:w-[160px] lg:w-[180px] flex-shrink-0"}
      >
        <AsyncSearchSelect
          key={selectKey}
          label={label}
          value={value}
          onChange={(val, option) => handleFilterChange(filterType, val, option)}
          endpoint={filterConfig.endpoint}
          searchParams={searchParams}
          selectedLabel={selectedLabels[filterType]}
          disabled={disabled}
          placeholder={`${label} seçin`}
          searchPlaceholder={`${label} axtar...`}
        />
      </div>
    );
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-5 lg:p-6">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 md:hidden">
        {/* Search and Status Row */}
        <div className="flex flex-col gap-3">
          <CustomInput
            label="Axtarış (ada görə)"
            value={localName}
            onChange={(e) => handleNameInputChange(e.target.value)}
            onKeyDown={handleNameInputKeyDown}
            onBlur={handleNameInputBlur}
            placeholder="Ad yazın..."
          />
          <CustomSelect
            label="Status"
            value={search?.status || ""}
            onChange={(value) => onStatusChange?.(value)}
            options={statusOptions}
          />
        </div>

        {hasFilters && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-4 w-4 text-gray-500" />
              <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium">
                Filtrlər
              </Typography>
            </div>
            {config.filters.map((filterType) => renderFilterSelect(filterType, true))}
          </div>
        )}

        {/* Items Per Page */}
        {itemsPerPageOptions && (
          <AppSelect
            items={itemsPerPageOptions}
            value={itemsPerPage}
            onChange={(value) => onItemsPerPageChange?.(value)}
            placeholder="Göstəriləcək say"
            allowAll={false}
          />
        )}

        {/* Active Filters */}
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
                  className={`bg-gradient-to-r ${config.gradientColors} text-white border-0 shadow-md`}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onCreateClick && (
            <Button
              type="button"
              onClick={handleRefreshFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg transition-all px-3"
              size="sm"
              title="Filterləri sıfırla və yenilə"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </Button>
          )}
          {onSearchClick && (
            <Button
              type="button"
              onClick={onSearchClick}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              size="sm"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>Ətraflı axtarış</span>
            </Button>
          )}
          {onCreateClick && (
            <Button
              type="button"
              onClick={onCreateClick}
              className={`flex-1 bg-gradient-to-r ${config.gradientColors} text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2`}
              size="sm"
            >
              <PlusIcon className="h-4 w-4" />
              <span>{config.addButtonText}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col gap-4">
        {/* Main Row - Search, Status, Filters, Actions */}
        <div className="flex items-end gap-3 flex-wrap">
          {/* Search Input */}
          <div className="w-full md:w-[200px] lg:w-[240px] flex-shrink-0">
            <CustomInput
              label="Axtarış (ada görə)"
              value={localName}
              onChange={(e) => handleNameInputChange(e.target.value)}
              onKeyDown={handleNameInputKeyDown}
              onBlur={handleNameInputBlur}
              placeholder="Ad yazın..."
            />
          </div>

          {/* Status Select */}
          <div className="w-full md:w-[140px] flex-shrink-0">
            <CustomSelect
              label="Status"
              value={search?.status || ""}
              onChange={(value) => onStatusChange?.(value)}
              options={statusOptions}
            />
          </div>

          {/* Filter Selects */}
          {config.filters.map((filterType) => renderFilterSelect(filterType, false))}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Items Per Page */}
          {itemsPerPageOptions && (
            <div className="w-[100px] flex-shrink-0">
              <AppSelect
                items={itemsPerPageOptions}
                value={itemsPerPage}
                onChange={(value) => onItemsPerPageChange?.(value)}
                placeholder="Say"
                allowAll={false}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {onCreateClick && (
              <Button
                type="button"
                onClick={handleRefreshFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg transition-all px-3"
                size="md"
                title="Filterləri sıfırla və yenilə"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </Button>
            )}
            {onSearchClick && (
              <Button
                type="button"
                onClick={onSearchClick}
                className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all px-4"
                size="md"
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Axtarış</span>
              </Button>
            )}
            {onCreateClick && (
              <Button
                type="button"
                onClick={onCreateClick}
                className={`bg-gradient-to-r ${config.gradientColors} flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all px-4`}
                size="md"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Əlavə et</span>
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Row */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
              Aktiv filtrlər:
            </Typography>
            <div className="flex flex-wrap items-center gap-2">
              {activeFilters.map((filter) => (
                <Chip
                  key={filter.key}
                  value={`${filter.label}: ${filter.value}`}
                  onClose={() => onRemoveFilter?.(filter.key)}
                  className={`bg-gradient-to-r ${config.gradientColors} text-white border-0 shadow-sm`}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagementActions;
