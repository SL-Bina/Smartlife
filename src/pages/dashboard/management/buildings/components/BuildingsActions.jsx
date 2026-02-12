import React, { useMemo, useEffect, useMemo as useMemoHook } from "react";
import { Button, Input, IconButton } from "@material-tailwind/react";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useManagementEnhanced, useMtkColor } from "@/store/exports";
import AppSelect from "@/components/ui/AppSelect";

const STANDARD_OPTIONS = [10, 25, 50, 75, 100];

export function BuildingsActions({
  search,
  onSearchChange,
  onCreateClick,
  onFilterClick,
  hasActiveFilters = false,
  totalItems = 0,
  itemsPerPage = 10,
  onItemsPerPageChange
}) {
  const { state, actions } = useManagementEnhanced();
  const { colorCode, getRgba } = useMtkColor();
  
  // Context-dən MTK və Complex məlumatlarını al
  const mtks = state.mtks || [];
  const complexes = state.complexes || [];
  const loadingMtks = state.loading?.mtks || false;
  const loadingComplexes = state.loading?.complexes || false;
  
  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultRed;

  // Context-dən filtered complexes al (artıq indexed maps-də var)
  const filteredComplexes = useMemo(() => {
    if (!state.mtkId) return complexes;
    
    // Context-dən indexed maps istifadə et
    const complexIds = state.indexedMaps?.complexIdsByMtkId?.[state.mtkId] || [];
    return complexes.filter(c => complexIds.includes(c.id));
  }, [complexes, state.mtkId, state.indexedMaps]);

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

  // Items per page seçimləri yarat
  const itemsPerPageOptions = useMemoHook(() => {
    // Əgər data sayı 25-dən azdırsa, select göstərmə
    if (totalItems < 25) {
      return null;
    }

    const options = [];
    const maxItems = Math.min(totalItems, 100); // Max 100
    
    // Həmişə 10 olmalıdır
    options.push(10);
    
    // Standart variantları əlavə et (yalnız maxItems-dən kiçik və ya bərabər olanlar)
    STANDARD_OPTIONS.slice(1).forEach(option => {
      if (option <= maxItems && !options.includes(option)) {
        options.push(option);
      }
    });
    
    // Əgər data sayı standart variantlar arasında deyilsə və 100-dən kiçikdirsə, əlavə et
    if (maxItems < 100 && !STANDARD_OPTIONS.includes(maxItems)) {
      // Data sayını uyğun yerə daxil et (sıralı şəkildə)
      const insertIndex = options.findIndex(opt => opt > maxItems);
      if (insertIndex === -1) {
        options.push(maxItems);
      } else {
        options.splice(insertIndex, 0, maxItems);
      }
    } else if (maxItems === 100 && !options.includes(100)) {
      // Əgər maxItems 100-dürsə və hələ əlavə olunmayıbsa
      options.push(100);
    }
    
    return options.map(value => ({
      id: value,
      name: String(value)
    }));
  }, [totalItems]);

  return (
    <div className="space-y-4">
      {/* MOBILE: Vertical Stack (< 768px) */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Search */}
        <Input
          label="Axtarış"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="dark:text-white"
          labelProps={{ className: "dark:text-gray-300" }}
        />

        {/* MTK Select */}
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
          }}
        />

        {/* Complex Select */}
        <AppSelect
          items={filteredComplexes}
          value={state.complexId || (filteredComplexes.length > 0 ? filteredComplexes[0].id : null)}
          loading={loadingComplexes}
          placeholder="Kompleks seç"
          allowAll={false}
          getValue={(x) => x.id}
          getLabel={(x) => x.name}
          onChange={(id, obj) => actions.setComplex(id, obj)}
        />

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={() => actions.resetAll()}
            className="dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            size="sm"
          >
            Sıfırla
          </Button>
          {onFilterClick && (
            <Button 
              variant="outlined" 
              color="blue-gray" 
              onClick={onFilterClick} 
              className={`border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white hover:shadow-lg flex items-center justify-center gap-1.5 ${
                hasActiveFilters ? "ring-2 ring-offset-1 shadow-md" : ""
              }`}
              style={{
                borderColor: hasActiveFilters ? activeColor : undefined,
                color: hasActiveFilters ? activeColor : undefined,
                ringColor: hasActiveFilters ? activeColor : undefined,
              }}
              size="sm"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Axtarış</span>
            </Button>
          )}
        </div>

        {/* Create Button - Full Width */}
        <Button
          onClick={onCreateClick}
          variant="outlined"
          className="w-full border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:shadow-lg flex items-center justify-center gap-2"
          size="md"
        >
          <PlusIcon className="h-5 w-5" />
          Bina əlavə et
        </Button>

        {/* Items Per Page - Mobile */}
        {itemsPerPageOptions && (
          <AppSelect
            items={itemsPerPageOptions}
            value={itemsPerPage}
            onChange={(value) => onItemsPerPageChange?.(value)}
            placeholder="Göstəriləcək say"
            allowAll={false}
          />
        )}
      </div>

      {/* TABLET & DESKTOP: Horizontal Layout (>= 768px) */}
      <div className="hidden md:flex md:flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section: Search, MTK, Complex */}
        <div className="flex flex-col lg:flex-row gap-3 flex-1 min-w-0">
          {/* Search Input */}
          <div className="w-full lg:w-[240px] xl:w-[280px] flex-shrink-0">
            <Input
              label="Axtarış"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-300" }}
            />
          </div>

          {/* MTK Select */}
          <div className="w-full lg:w-[220px] xl:w-[260px] flex-shrink-0">
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
              }}
            />
          </div>

          {/* Complex Select */}
          <div className="w-full lg:w-[240px] xl:w-[280px] flex-shrink-0">
            <AppSelect
              items={filteredComplexes}
              value={state.complexId || (filteredComplexes.length > 0 ? filteredComplexes[0].id : null)}
              loading={loadingComplexes}
              placeholder="Kompleks seç"
              allowAll={false}
              getValue={(x) => x.id}
              getLabel={(x) => x.name}
              onChange={(id, obj) => actions.setComplex(id, obj)}
            />
          </div>

          {/* Scope Reset Button */}
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={() => actions.resetAll()}
            className="dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap lg:w-auto"
            size="md"
          >
            Scope sıfırla
          </Button>
        </div>

        {/* Right Section: Items Per Page, Filter, Create */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 lg:flex-shrink-0">
          {/* Items Per Page */}
          {itemsPerPageOptions && (
            <div className="w-full md:w-[140px] lg:w-[150px] flex-shrink-0">
              <AppSelect
                items={itemsPerPageOptions}
                value={itemsPerPage}
                onChange={(value) => onItemsPerPageChange?.(value)}
                placeholder="Göstəriləcək say"
                allowAll={false}
              />
            </div>
          )}

          {/* Filter Button */}
          {onFilterClick && (
            <Button 
              variant="outlined" 
              color="blue-gray" 
              onClick={onFilterClick} 
              className={`flex items-center justify-center gap-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white hover:shadow-lg transition-all whitespace-nowrap ${
                hasActiveFilters ? "ring-2 ring-offset-2 shadow-md" : ""
              }`}
              style={{
                borderColor: hasActiveFilters ? activeColor : undefined,
                color: hasActiveFilters ? activeColor : undefined,
                ringColor: hasActiveFilters ? activeColor : undefined,
              }}
              size="md"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Axtarış</span>
            </Button>
          )}

          {/* Create Button */}
          <Button
            onClick={onCreateClick}
            variant="outlined"
            className="flex items-center justify-center gap-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:shadow-lg transition-all whitespace-nowrap"
            size="md"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Bina əlavə et</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
