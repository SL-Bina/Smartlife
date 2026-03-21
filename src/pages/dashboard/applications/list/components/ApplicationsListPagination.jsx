import React from "react";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/components/common";

export function ApplicationsListPagination({ page, totalPages, onPageChange, onPrev, onNext }) {
  const { t } = useTranslation();

  return <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} onPrev={onPrev} onNext={onNext} prevLabel={t("applications.list.pagination.prev")} nextLabel={t("applications.list.pagination.next")} />;
}

