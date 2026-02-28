import React from "react";
import SmartPagination from "@/components/ui/SmartPagination";

export function PropertyPagination({ page, lastPage, onPageChange, total = 0 }) {
  return <SmartPagination page={page} totalPages={lastPage} onPageChange={onPageChange} summary={<>Cəm: <b>{total}</b> nəticə</>} prevLabel="Əvvəlki" nextLabel="Növbəti" />;
}

