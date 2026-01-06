import React, { useState } from "react";
import { Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useReportsData } from "./hooks/useReportsData";
import { useReportsFilters } from "./hooks/useReportsFilters";
import { exportReport } from "./api";
import { ReportsHeader } from "./components/ReportsHeader";
import { IncomeExpensesCard } from "./components/IncomeExpensesCard";
import { BalancesProfitLossCard } from "./components/BalancesProfitLossCard";
import { ResidentsReceivablesTable } from "./components/ResidentsReceivablesTable";
import { ReportsFilterModal } from "./components/modals/ReportsFilterModal";

const ReportsPage = () => {
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useReportsFilters();
  const { reports, loading, error } = useReportsData(filters, refreshKey);

  const handleFilterApply = () => {
    applyFilters();
    setRefreshKey((prev) => prev + 1);
  };

  const handleFilterClear = () => {
    clearFilters();
    setRefreshKey((prev) => prev + 1);
  };

  const handleExport = async () => {
    try {
      const blob = await exportReport(filters, "pdf");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${filters.startDate}_${filters.endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  return (
    <div className="space-y-6">
      <ReportsHeader
        startDate={filters.startDate}
        endDate={filters.endDate}
        currency={filters.currency}
        onFilterClick={() => setFilterOpen(true)}
        onExportClick={handleExport}
      />

      <ReportsFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Spinner className="h-6 w-6 dark:text-blue-400" />
          <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
            {t("reports.actions.loading")}
          </Typography>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Typography variant="small" className="text-red-600 dark:text-red-400">
            {t("reports.error.loading")}: {error}
          </Typography>
        </div>
      ) : reports ? (
        <div className="space-y-4">
          <IncomeExpensesCard
            incomeData={reports.income}
            expenseData={reports.expenses}
            currency={filters.currency}
          />

          <BalancesProfitLossCard
            balanceData={reports.balances}
            previousMonthData={reports.previousMonth}
            incomeData={reports.income}
            expenseData={reports.expenses}
            currency={filters.currency}
          />

          <ResidentsReceivablesTable
            residentsReceivablesData={reports.residentsReceivables}
            currency={filters.currency}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ReportsPage;
