import React from "react";
import { Pagination } from "@/components/common";

export function UsersPagination({ page, lastPage, onPageChange, total = 0 }) {
  return <Pagination page={page} totalPages={lastPage} onPageChange={onPageChange} summary={<>Cəm: <b>{total}</b> nəticə</>} prevLabel="Əvvəlki" nextLabel="Növbəti" />;
}

