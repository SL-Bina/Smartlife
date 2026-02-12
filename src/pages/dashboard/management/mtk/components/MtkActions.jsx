import React, { useMemo } from "react";
import { Button, Input } from "@material-tailwind/react";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useManagement } from "@/store/hooks/useManagement";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import AppSelect from "@/components/ui/AppSelect";

const STANDARD_OPTIONS = [10, 25, 50, 75, 100];

export function MtkActions({ 
  search, 
  onSearchChange, 
  onCreateClick, 
  onFilterClick, 
  hasActiveFilters = false,
  totalItems = 0,
  itemsPerPage = 10,
  onItemsPerPageChange
}) {
  const { actions } = useManagement();
  const { colorCode } = useMtkColor();
  
  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultRed;

  // Items per page seçimləri yarat
  const itemsPerPageOptions = useMemo(() => {
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
          MTK əlavə et
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
        {/* Left Section: Search, Scope Reset */}
        <div className="flex flex-col lg:flex-row gap-3 flex-1 min-w-0">
          {/* Search Input */}
          <div className="w-full lg:w-[280px] xl:w-[320px] flex-shrink-0">
            <Input
              label="Axtarış"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-300" }}
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
            <span>MTK əlavə et</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
