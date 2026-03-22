import React, { useState, useEffect } from "react";
import { Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useDebtorApartmentsData } from "./hooks/useDebtorApartmentsData";
import { useDebtorApartmentsFilters } from "./hooks/useDebtorApartmentsFilters";
import { usePaymentForm } from "./hooks/usePaymentForm";
import { payInvoices, exportToExcel, fetchInvoices } from "./api";
import { DebtorApartmentsHeader } from "./components/DebtorApartmentsHeader";
import { DebtorApartmentsActions } from "./components/DebtorApartmentsActions";
import { DebtorApartmentsTable } from "./components/DebtorApartmentsTable";
import { DebtorApartmentsCardList } from "./components/DebtorApartmentsCardList";
import { DebtorApartmentsPagination } from "./components/DebtorApartmentsPagination";
import { DebtorApartmentsFilterModal } from "./components/modals/DebtorApartmentsFilterModal";
import { DebtorApartmentsViewModal } from "./components/modals/DebtorApartmentsViewModal";
import { DebtorApartmentsPayModal } from "./components/modals/DebtorApartmentsPayModal";
import { useDynamicToast } from "@/hooks/useDynamicToast";

const DebtorApartmentsPage = () => {
  const { t } = useTranslation();
  const { toast, showToast, closeToast } = useDynamicToast();
  const [viewOpen, setViewOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [invoicesForPay, setInvoicesForPay] = useState([]);
  const [saving, setSaving] = useState(false);

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

  const openPayModal = async (item) => {
    setSelectedItem(item);
    setInvoicesForPay([]);
    resetForm();
    loadPaymentMethods();
    setPayOpen(true);
    // Pre-load this apartment's invoices so we have real invoice IDs ready
    try {
      const invoices = await fetchInvoices(item.id);
      const unpaid = invoices.filter((inv) => (inv.remaining ?? inv.amount ?? 0) > 0);
      setInvoicesForPay(unpaid);
      const totalRemaining = unpaid.reduce((sum, inv) => sum + parseFloat(inv.remaining ?? inv.amount ?? 0), 0);
      setAmountValue(String(totalRemaining));
    } catch (err) {
      console.error("Error loading invoices for pay modal:", err);
    }
  };

  const handlePaySave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const selectedInvoices = selectedItem?.selectedInvoices || [];
      const selectedInvoicesData = selectedItem?.selectedInvoicesData || [];

      let invoices;
      if (selectedInvoices.length > 0) {
        // From ViewModal: user selected specific invoices
        invoices = selectedInvoices.map((invoiceId, idx) => ({
          id: invoiceId,
          amount_paid: parseFloat(
            selectedInvoicesData[idx]?.amount_paid ??
            selectedInvoicesData[idx]?.amount ??
            amount
          ),
          payment_method_id: paymentMethodId,
          ...(note ? { desc: note } : {}),
          ...(paymentDate ? { paid_at: paymentDate } : {}),
        }));
      } else if (invoicesForPay.length > 0) {
        // From direct Pay button: pay all pre-loaded unpaid invoices at their remaining amounts
        invoices = invoicesForPay.map((inv) => ({
          id: inv.id,
          amount_paid: parseFloat(inv.remaining ?? inv.amount ?? 0),
          payment_method_id: paymentMethodId,
          ...(note ? { desc: note } : {}),
          ...(paymentDate ? { paid_at: paymentDate } : {}),
        }));
      } else {
        throw new Error("No invoices to pay");
      }

      await payInvoices(invoices);
      setPayOpen(false);
      resetForm();
      setInvoicesForPay([]);
      setRefreshKey((prev) => prev + 1);
      showToast({ type: "success", message: t("debtorApartments.pay.success") || "Ödəniş uğurla tamamlandı" });
    } catch (error) {
      console.error("Error paying invoices:", error);
      showToast({ type: "error", message: t("debtorApartments.pay.error") || "Ödəniş zamanı xəta baş verdi" });
    } finally {
      setSaving(false);
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
                onPay={openPayModal}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />
              <DebtorApartmentsCardList
                apartments={apartments}
                onView={openViewModal}
                onPay={openPayModal}
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
          setInvoicesForPay([]); // selectedInvoices içindədir, preloaded lazım deyil
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
        saving={saving}
      />     </div>
  );
};

export default DebtorApartmentsPage;
