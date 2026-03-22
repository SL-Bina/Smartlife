import React from "react";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/components";

export function DepositPagination({ page, totalPages, onPageChange, onPrev, onNext }) {
  const { t } = useTranslation();

  return <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} onPrev={onPrev} onNext={onNext} prevLabel={t("deposit.pagination.prev")} nextLabel={t("deposit.pagination.next")} />;
}

