import React from "react";
import { Button } from "@material-tailwind/react";

export function SmartPagination({
  page,
  totalPages,
  onPageChange,
  onPrev,
  onNext,
  prevLabel = "Previous",
  nextLabel = "Next",
  summary,
}) {
  if (!totalPages || totalPages <= 1) {
    if (!summary) return null;
    return (
      <div className="px-4 pt-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">1 / 1</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{summary}</div>
        </div>
      </div>
    );
  }

  const currentPage = Number(page) || 1;
  const currentTotalPages = Number(totalPages) || 1;

  const handlePrev = onPrev || (() => onPageChange?.(Math.max(1, currentPage - 1)));
  const handleNext = onNext || (() => onPageChange?.(Math.min(currentTotalPages, currentPage + 1)));

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7;

    if (currentTotalPages <= maxVisible) {
      for (let pageNumber = 1; pageNumber <= currentTotalPages; pageNumber += 1) {
        pages.push(pageNumber);
      }
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(currentTotalPages - 1, currentPage + 1);

    if (start > 2) pages.push("left-ellipsis");

    for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
      pages.push(pageNumber);
    }

    if (end < currentTotalPages - 1) pages.push("right-ellipsis");

    pages.push(currentTotalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pt-1">
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
          {currentPage} / {currentTotalPages}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Button
            variant="text"
            size="sm"
            color="blue-gray"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="rounded-xl px-3 normal-case dark:text-gray-300 dark:hover:bg-gray-700/70 dark:disabled:text-gray-600"
          >
            {prevLabel}
          </Button>

          <div className="flex items-center gap-1 overflow-x-auto max-w-full">
            {visiblePages.map((item, index) => {
              if (typeof item === "string") {
                return (
                  <span key={item + index} className="px-2 text-sm text-gray-500 dark:text-gray-400 select-none">
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={item}
                  variant={item === currentPage ? "filled" : "text"}
                  size="sm"
                  color={item === currentPage ? "blue" : "blue-gray"}
                  onClick={() => onPageChange?.(item)}
                  className={`min-w-[36px] h-9 px-2 rounded-xl ${
                    item === currentPage
                      ? "shadow-md dark:bg-blue-600 dark:hover:bg-blue-700"
                      : "dark:text-gray-300 dark:hover:bg-gray-700/70"
                  }`}
                >
                  {item}
                </Button>
              );
            })}
          </div>

          <Button
            variant="text"
            size="sm"
            color="blue-gray"
            onClick={handleNext}
            disabled={currentPage === currentTotalPages}
            className="rounded-xl px-3 normal-case dark:text-gray-300 dark:hover:bg-gray-700/70 dark:disabled:text-gray-600"
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SmartPagination;

//deploy
