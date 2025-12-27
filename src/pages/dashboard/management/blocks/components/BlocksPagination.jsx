import React from "react";
import { Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function BlocksPagination({ page, totalPages, onPageChange, onPrev, onNext }) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2 px-6 pt-4">
      <Button
        variant="text"
        size="sm"
        color="blue-gray"
        onClick={onPrev}
        disabled={page === 1}
        className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
      >
        {t("blocks.pagination.prev")}
      </Button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === page ? "filled" : "text"}
          size="sm"
          color={pageNumber === page ? "blue" : "blue-gray"}
          onClick={() => onPageChange(pageNumber)}
          className={`min-w-[32px] px-2 ${
            pageNumber === page
              ? "dark:bg-blue-600 dark:hover:bg-blue-700"
              : "dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {pageNumber}
        </Button>
      ))}
      <Button
        variant="text"
        size="sm"
        color="blue-gray"
        onClick={onNext}
        disabled={page === totalPages}
        className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
      >
        {t("blocks.pagination.next")}
      </Button>
    </div>
  );
}

