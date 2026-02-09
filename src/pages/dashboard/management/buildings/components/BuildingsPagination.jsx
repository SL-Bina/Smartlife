import React, { useMemo } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/context";

export function BuildingsPagination({ page, lastPage, onPageChange, total = 0 }) {
  const { colorCode, getRgba, defaultColor } = useMtkColor();
  
  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultRed;

  if (!lastPage || lastPage <= 1) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-blue-gray-600 dark:text-gray-300">
          Cəm: <b>{total}</b> nəticə
        </div>
        <div className="text-xs text-blue-gray-400 dark:text-gray-400">Səhifə: 1</div>
      </div>
    );
  }

  const canPrev = page > 1;
  const canNext = page < lastPage;

  // Generate page numbers to show
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    
    if (lastPage <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      if (page <= 3) {
        // Near the start
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (page >= lastPage - 2) {
        // Near the end
        for (let i = lastPage - 4; i <= lastPage; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        for (let i = page - 2; i <= page + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  }, [page, lastPage]);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="text-sm text-blue-gray-600 dark:text-gray-300">
        Cəm: <b>{total}</b> nəticə
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          variant="outlined"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange?.(page - 1)}
          className="dark:border-gray-600 dark:text-gray-300 disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </IconButton>

        <div className="flex items-center gap-1">
          {pageNumbers.map((num) => (
            <Button
              key={num}
              size="sm"
              variant={num === page ? "filled" : "outlined"}
              color={num === page ? undefined : "blue-gray"}
              onClick={() => onPageChange?.(num)}
              className={`min-w-[40px] ${
                num === page
                  ? "text-white"
                  : "dark:border-gray-600 dark:text-gray-300 hover:bg-blue-gray-50 dark:hover:bg-gray-700"
              }`}
              style={num === page ? {
                backgroundColor: activeColor,
              } : {}}
              onMouseEnter={(e) => {
                if (num !== page) {
                  e.currentTarget.style.backgroundColor = colorCode 
                    ? getRgba(0.1) 
                    : "rgba(220, 38, 38, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (num !== page) {
                  e.currentTarget.style.backgroundColor = "";
                }
              }}
            >
              {num}
            </Button>
          ))}
        </div>

        <IconButton
          variant="outlined"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange?.(page + 1)}
          className="dark:border-gray-600 dark:text-gray-300 disabled:opacity-50"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}
