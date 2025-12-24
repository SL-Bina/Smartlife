import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useDebtorApartmentsData } from "./hooks/useDebtorApartmentsData";
import { useDebtorApartmentsFilters } from "./hooks/useDebtorApartmentsFilters";
import { usePaymentForm } from "./hooks/usePaymentForm";
import { payDebt } from "./api";
import { DebtorApartmentsHeader } from "./components/DebtorApartmentsHeader";
import { DebtorApartmentsSummaryCard } from "./components/DebtorApartmentsSummaryCard";
import { DebtorApartmentsActions } from "./components/DebtorApartmentsActions";
import { DebtorApartmentsTable } from "./components/DebtorApartmentsTable";
import { DebtorApartmentsCardList } from "./components/DebtorApartmentsCardList";
import { DebtorApartmentsPagination } from "./components/DebtorApartmentsPagination";
import { DebtorApartmentsFilterModal } from "./components/modals/DebtorApartmentsFilterModal";
import { DebtorApartmentsViewModal } from "./components/modals/DebtorApartmentsViewModal";
import { DebtorApartmentsPayModal } from "./components/modals/DebtorApartmentsPayModal";
import { DebtorApartmentsInvoicesModal } from "./components/modals/DebtorApartmentsInvoicesModal";

const DebtorApartmentsPage = () => {
  const { t } = useTranslation();
  const [viewOpen, setViewOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [invoicesOpen, setInvoicesOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useDebtorApartmentsFilters();
  const { apartments, totalDebt, loading, error, pagination } = useDebtorApartmentsData(filters, page, refreshKey);
  const { amount, setAmountValue, resetForm } = usePaymentForm();

  // Reset page when filters change
  useEffect(() => {
    if (page > (pagination.totalPages || 1) && pagination.totalPages > 0) {
      setPage(1);
    }
  }, [pagination.totalPages, page]);

  const handleFilterApply = () => {
    setPage(1);
    applyFilters();
  };

  const handleFilterClear = () => {
    clearFilters();
    setPage(1);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const openPayModal = (item) => {
    setSelectedItem(item);
    resetForm();
    setPayOpen(true);
  };

  const openInvoicesModal = (item) => {
    setSelectedItem(item);
    setInvoicesOpen(true);
  };

  const handlePaySave = async () => {
    try {
      if (selectedItem && amount) {
        await payDebt(selectedItem.id, { amount: parseFloat(amount) });
        setPayOpen(false);
        setSelectedItem(null);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error paying debt:", error);
    }
  };

  // Pagination functions
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= (pagination.totalPages || 1)) {
      setPage(pageNumber);
    }
  };

  const goToPrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (page < (pagination.totalPages || 1)) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="">
      <DebtorApartmentsHeader />
      <DebtorApartmentsSummaryCard totalDebt={totalDebt} />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <DebtorApartmentsActions onFilterClick={() => setFilterOpen(true)} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("debtorApartments.actions.loading")}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="small" className="text-red-600 dark:text-red-400">
                {t("debtorApartments.error.loading")}: {error}
              </Typography>
            </div>
          ) : (
            <>
              <DebtorApartmentsTable
                apartments={apartments}
                onView={openViewModal}
                onPay={openPayModal}
                onInvoices={openInvoicesModal}
              />
              <DebtorApartmentsCardList
                apartments={apartments}
                onView={openViewModal}
                onPay={openPayModal}
                onInvoices={openInvoicesModal}
              />
              <DebtorApartmentsPagination
                page={page}
                totalPages={pagination.totalPages}
                onPageChange={goToPage}
                onPrev={goToPrev}
                onNext={goToNext}
              />
            </>
          )}
        </CardBody>
      </Card>

      {/* Modals */}
      <DebtorApartmentsFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <DebtorApartmentsViewModal open={viewOpen} onClose={() => setViewOpen(false)} apartment={selectedItem} />

      <DebtorApartmentsPayModal
        open={payOpen}
        onClose={() => {
          setPayOpen(false);
          setSelectedItem(null);
        }}
        apartment={selectedItem}
        amount={amount}
        onAmountChange={setAmountValue}
        onSave={handlePaySave}
      />

      <DebtorApartmentsInvoicesModal
        open={invoicesOpen}
        onClose={() => {
          setInvoicesOpen(false);
          setSelectedItem(null);
        }}
        apartment={selectedItem}
      />
    </div>
  );
};

export default DebtorApartmentsPage;
