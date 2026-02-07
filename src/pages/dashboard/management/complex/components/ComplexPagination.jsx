import React from "react";
import { Button } from "@material-tailwind/react";

export function ComplexPagination({ page, lastPage, onPageChange }) {
  if (!lastPage || lastPage <= 1) {
    return <div className="text-xs text-blue-gray-400 dark:text-gray-400">Səhifə: 1</div>;
  }

  const canPrev = page > 1;
  const canNext = page < lastPage;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-sm text-blue-gray-600 dark:text-gray-300">
        Səhifə: <b>{page}</b> / {lastPage}
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outlined" disabled={!canPrev} onClick={() => onPageChange?.(page - 1)}>
          Prev
        </Button>
        <Button size="sm" variant="outlined" disabled={!canNext} onClick={() => onPageChange?.(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
