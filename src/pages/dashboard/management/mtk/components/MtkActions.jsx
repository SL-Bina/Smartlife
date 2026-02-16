import React, { useMemo, useState, useEffect } from "react";
import { Button, Input, Select, Option, Chip, Typography } from "@material-tailwind/react";
import { PlusIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AppSelect from "@/components/ui/AppSelect";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearSelectedMtk } from "@/store/slices/mtkSlice";

const STANDARD_OPTIONS = [10, 20, 50, 75, 100];

export function MtkActions({ 
  search = {}, 
  onCreateClick, 
  onSearchClick,
  onNameSearchChange,
  onStatusChange,
  onRemoveFilter,
  onApplyNameSearch,
  totalItems = 0,
  itemsPerPage = 20,
  onItemsPerPageChange
}) {
  const dispatch = useAppDispatch();
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  
  const [localName, setLocalName] = useState(search?.name || "");

  useEffect(() => {
    setLocalName(search?.name || "");
  }, [search?.name]);

  const handleClearSelection = () => {
    dispatch(clearSelectedMtk());
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

  const filterLabels = {
    phone: "Telefon",
    email: "E-mail",
    website: "Website",
    desc: "Təsvir",
    lat: "Enlem",
    lng: "Boylam",
    color_code: "Rəng Kodu",
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
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow"
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {selectedMtkId && (
            <Button
              onClick={handleClearSelection}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all"
              size="md"
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              Seçimi ləğv et
            </Button>
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
              MTK əlavə et
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col lg:flex-row gap-3 flex-1 min-w-0">
            <div className="w-full lg:w-[300px] xl:w-[350px] flex-shrink-0">
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
            <div className="w-full lg:w-[160px] flex-shrink-0">
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
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow"
                    size="sm"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:flex-shrink-0">
            {selectedMtkId && (
              <Button
                onClick={handleClearSelection}
                className="bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all whitespace-nowrap"
                size="md"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Seçimi ləğv et
              </Button>
            )}

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
              className="bg-gradient-to-r from-green-500 flex items-center justify-center to-green-600 text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all whitespace-nowrap"
              size="md"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              MTK əlavə et
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
