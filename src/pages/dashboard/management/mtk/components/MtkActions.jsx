import React, { useMemo } from "react";
import { Button, Input, IconButton, Typography } from "@material-tailwind/react";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useManagementEnhanced } from "@/context";
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
  const { state, actions } = useManagementEnhanced();

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3 items-center flex-wrap">
        <div className="w-full sm:w-[280px]">
          <Input
            label="Axtarış"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-300" }}
          />
        </div>


        <Button
          variant="outlined"
          color="blue-gray"
          onClick={() => actions.resetAll()}
          className="dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Scope sıfırla
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {itemsPerPageOptions && (
          <div className="w-full sm:w-auto">
            <AppSelect
              items={itemsPerPageOptions}
              value={itemsPerPage}
              onChange={(value) => onItemsPerPageChange?.(value)}
              placeholder="Göstəriləcək say"
              allowAll={false}
            />
          </div>
        )}
        <Button variant="outlined" color="blue-gray" onClick={onFilterClick} className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white hover:shadow-lg flex items-center gap-2">
          <FunnelIcon className="h-5 w-5" />
          Axtarış
        </Button>
        <Button
          onClick={onCreateClick}
          variant="outlined"
          className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:shadow-lg flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          MTK əlavə et
      </Button>
      </div>
    </div>
  );
}
