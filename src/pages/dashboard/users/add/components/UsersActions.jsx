import React, { useMemo, useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AppSelect from "@/components/ui/AppSelect";

const STANDARD_OPTIONS = [10, 25, 50, 75, 100];

export function UsersActions({
  search,
  onSearchChange,
  onSearchClick,
  onCreateClick,
  totalItems = 0,
  itemsPerPage = 10,
  onItemsPerPageChange,
}) {
  const [localSearch, setLocalSearch] = useState(search || "");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearchChange?.(localSearch);
  };
  const handleBlur = () => onSearchChange?.(localSearch);
  const handleClear = () => { setLocalSearch(""); onSearchChange?.(""); };

  const itemsPerPageOptions = useMemo(() => {
    if (totalItems < 25) return null;
    const options = [];
    const maxItems = Math.min(totalItems, 100);
    options.push(10);
    STANDARD_OPTIONS.slice(1).forEach((opt) => {
      if (opt <= maxItems && !options.includes(opt)) options.push(opt);
    });
    if (maxItems < 100 && !STANDARD_OPTIONS.includes(maxItems)) {
      const idx = options.findIndex((o) => o > maxItems);
      if (idx === -1) options.push(maxItems);
      else options.splice(idx, 0, maxItems);
    } else if (maxItems === 100 && !options.includes(100)) {
      options.push(100);
    }
    return options.map((value) => ({ id: value, name: String(value) }));
  }, [totalItems]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 flex-wrap">
      {/* Left: search + per-page */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        <div className="relative w-full sm:w-60">
          <Input
            label="Axtarış"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            icon={
              localSearch ? (
                <XMarkIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600" onClick={handleClear} />
              ) : (
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              )
            }
            className="!text-sm dark:text-white"
            labelProps={{ className: "dark:text-gray-300" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>

        {itemsPerPageOptions && (
          <div className="w-full sm:w-36 flex-shrink-0">
            <AppSelect
              items={itemsPerPageOptions}
              value={itemsPerPage}
              onChange={(value) => onItemsPerPageChange?.(value)}
              placeholder="Göstər"
              allowAll={false}
            />
          </div>
        )}

        {totalItems > 0 && (
          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs hidden sm:block">
            Cəm: <b>{totalItems}</b>
          </Typography>
        )}
      </div>

      {/* Right: buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant="outlined"
          onClick={onSearchClick}
          className="flex items-center gap-1.5 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          Ətraflı axtarış
        </Button>
        <Button
          size="sm"
          color="red"
          onClick={onCreateClick}
          className="flex items-center gap-1.5 flex-shrink-0"
        >
          <PlusIcon className="h-4 w-4" />
          Əlavə et
        </Button>
      </div>
    </div>
  );
}
