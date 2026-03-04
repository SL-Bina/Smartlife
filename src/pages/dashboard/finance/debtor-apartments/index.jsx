import React, { useState, useEffect } from "react";
import { Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useDebtorApartmentsData } from "./hooks/useDebtorApartmentsData";
import { useDebtorApartmentsFilters } from "./hooks/useDebtorApartmentsFilters";
import { usePaymentForm } from "./hooks/usePaymentForm";
import { payInvoices, exportToExcel } from "./api";
import { DebtorApartmentsHeader } from "./components/DebtorApartmentsHeader";
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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const { apartments, totalDebt, loading, error, pagination } = useDebtorApartmentsData(filters, page, refreshKey, sortConfig);
  const {
    amount,
    note,
    paymentMethodId,
    paymentDate,
    paymentMethods,
    methodsLoading,
    loadPaymentMethods,
    setAmountValue,
    setPaymentField,
    resetForm,
  } = usePaymentForm();

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

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
    setPage(1);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const openPayModal = (item) => {
    setSelectedItem(item);
    resetForm();
    loadPaymentMethods();
    setPayOpen(true);
  };

  const openInvoicesModal = (item) => {
    setSelectedItem(item);
    setInvoicesOpen(true);
  };

  const handlePaySave = async () => {
    try {
      if (selectedItem && amount && paymentMethodId) {
        // Build invoice payload: one entry per selected invoice, or a single entry
        const selectedInvoices = selectedItem.selectedInvoices || [];
        const selectedInvoicesData = selectedItem.selectedInvoicesData || [];
        const invoices = selectedInvoices.length > 0
          ? selectedInvoices.map((invoiceId, idx) => ({
              id: invoiceId,
              amount_paid: parseFloat(
                selectedInvoicesData[idx]?.amount_paid ??
                selectedInvoicesData[idx]?.amount ??
                amount
              ),
              payment_method_id: paymentMethodId,
              ...(note ? { desc: note } : {}),
              ...(paymentDate ? { paid_at: paymentDate } : {}),
            }))
          : [{
              id: selectedItem.id,
              amount_paid: parseFloat(amount),
              payment_method_id: paymentMethodId,
              ...(note ? { desc: note } : {}),
              ...(paymentDate ? { paid_at: paymentDate } : {}),
            }];

        await payInvoices(invoices);
        setPayOpen(false);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error paying invoices:", error);
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

  const handleExport = async () => {
    try {
      const blob = await exportToExcel(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `borcu_olan_menziller_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <div className="space-y-4" style={{ position: 'relative', zIndex: 0 }}>
      <DebtorApartmentsHeader />

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700/50">
          <DebtorApartmentsActions
            onFilterClick={() => setFilterOpen(true)}
            onExportClick={handleExport}
          />
        </div>
        <div>
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
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
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
        </div>
      </div>

      {/* Modals */}
      <DebtorApartmentsFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <DebtorApartmentsViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        apartment={selectedItem}
        onPay={(data) => {
          // View modal qalır, sadəcə ödəniş modalını açırıq
          setSelectedItem(data);
          resetForm();
          setAmountValue(String(data?.selectedAmount || ""));
          loadPaymentMethods();
          const today = new Date();
          setPaymentField("paymentDate", today.toISOString().split("T")[0]);
          setPaymentField("note", "");
          setPayOpen(true);
        }}
      />

      <DebtorApartmentsPayModal
        open={payOpen}
        onClose={() => {
          setPayOpen(false);
        }}
        apartment={selectedItem}
        amount={amount}
        onAmountChange={setAmountValue}
        note={note}
        paymentMethodId={paymentMethodId}
        paymentMethods={paymentMethods}
        methodsLoading={methodsLoading}
        paymentDate={paymentDate}
        onFieldChange={setPaymentField}
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
