import React, { useMemo } from "react";
import { Button, Input } from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import AppSelect from "@/components/ui/AppSelect";

const STANDARD_OPTIONS = [10, 25, 50, 75, 100];

export function UsersActions({ 
  search, 
  onSearchChange, 
  onCreateClick, 
  totalItems = 0,
  itemsPerPage = 10,
  onItemsPerPageChange
}) {
  const { colorCode } = useMtkColor();
  
  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultRed;
  const itemsPerPageOptions = useMemo(() => {
    if (totalItems < 25) {
      return null;
    }

    const options = [];
    const maxItems = Math.min(totalItems, 100);
    
    options.push(10);
    
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
    <div className="space-y-4">
      {/* MOBILE: Vertical Stack (< 768px) */}
      <div className="flex flex-col gap-3 md:hidden">
        <Input
          label="Axtarış"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="dark:text-white"
          labelProps={{ className: "dark:text-gray-300" }}
        />

        <Button
          onClick={onCreateClick}
          variant="outlined"
          className="w-full border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:shadow-lg flex items-center justify-center gap-2"
          size="md"
        >
          <PlusIcon className="h-5 w-5" />
          İstifadəçi əlavə et
        </Button>

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
        <div className="flex flex-col lg:flex-row gap-3 flex-1 min-w-0">
          <div className="w-full lg:w-[280px] xl:w-[320px] flex-shrink-0">
            <Input
              label="Axtarış"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-300" }}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 lg:flex-shrink-0">
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

          <Button
            onClick={onCreateClick}
            variant="outlined"
            className="flex items-center justify-center gap-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:shadow-lg transition-all whitespace-nowrap"
            size="md"
          >
            <PlusIcon className="h-5 w-5" />
            <span>İstifadəçi əlavə et</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

