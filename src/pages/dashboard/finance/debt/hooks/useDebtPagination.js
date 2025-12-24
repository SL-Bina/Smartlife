import { useState, useEffect } from "react";

export function useDebtPagination(totalPages) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages, page]);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const goToPrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const resetPage = () => {
    setPage(1);
  };

  return {
    page,
    goToPage,
    goToPrev,
    goToNext,
    resetPage,
  };
}

