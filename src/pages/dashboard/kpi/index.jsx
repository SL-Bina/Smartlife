import React, { useState } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useKPIData } from "./hooks/useKPIData";
import { useKPIFilters } from "./hooks/useKPIFilters";
import { exportKPIToExcel, exportKPIToPDF } from "./api";
import { KPIHeader } from "./components/KPIHeader";
import { KPIActions } from "./components/KPIActions";
import { KPITable } from "./components/KPITable";
import { KPIFilterModal } from "./components/modals/KPIFilterModal";

const KPIPage = () => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState("2025-11-01");
  const [endDate, setEndDate] = useState("2025-11-20");
  const [refreshKey, setRefreshKey] = useState(0);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useKPIFilters();
  const { kpiData, loading, error } = useKPIData(filters, startDate, endDate, refreshKey);

  const handleSearchApply = () => {
    applyFilters();
    setRefreshKey((prev) => prev + 1);
  };

  const handleSearchClear = () => {
    clearFilters();
    setRefreshKey((prev) => prev + 1);
  };

  const handleExcelExport = async () => {
    try {
      const blob = await exportKPIToExcel(filters, startDate, endDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kpi-report-${startDate}-${endDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const handlePDFExport = async () => {
    try {
      const blob = await exportKPIToPDF(filters, startDate, endDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kpi-report-${startDate}-${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  return (
    <div className="">
      <KPIHeader />

      <KPIActions
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearchClick={() => setFilterOpen(true)}
        onExcelExport={handleExcelExport}
        onPDFExport={handlePDFExport}
      />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardBody className="p-0 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("kpi.loading")}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="small" className="text-red-600 dark:text-red-400">
                {t("kpi.error") || "Xəta"}: {error}
              </Typography>
            </div>
          ) : (
            <KPITable kpiData={kpiData} loading={loading} />
          )}
        </CardBody>
      </Card>

      <KPIFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleSearchApply}
        onClear={handleSearchClear}
      />
    </div>
  );
};

export default KPIPage;
