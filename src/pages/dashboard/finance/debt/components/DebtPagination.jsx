import React from "react";
import { useTranslation } from "react-i18next";
import SmartPagination from "@/components/ui/SmartPagination";

export function DebtPagination({ page, totalPages, onPageChange, onPrev, onNext }) {
  const { t } = useTranslation();

  return <SmartPagination page={page} totalPages={totalPages} onPageChange={onPageChange} onPrev={onPrev} onNext={onNext} prevLabel={t("debt.pagination.prev")} nextLabel={t("debt.pagination.next")} />;
}

