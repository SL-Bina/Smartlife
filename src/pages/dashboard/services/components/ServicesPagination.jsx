import React from "react";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/components";

export function ServicesPagination({ page, totalPages, onPageChange, onPrev, onNext }) {
  const { t } = useTranslation();

  return <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} onPrev={onPrev} onNext={onNext} prevLabel={t("services.pagination.prev") || t("pagination.previous")} nextLabel={t("services.pagination.next") || t("pagination.next")} />;
}

