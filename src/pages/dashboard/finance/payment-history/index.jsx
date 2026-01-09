import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { usePaymentHistoryData } from "./hooks/usePaymentHistoryData";
import { usePaymentHistoryFilters } from "./hooks/usePaymentHistoryFilters";
import { usePaymentHistoryForm } from "./hooks/usePaymentHistoryForm";
import { updatePaymentHistory, deletePaymentHistory } from "./api";
import { PaymentHistoryHeader } from "./components/PaymentHistoryHeader";
import { PaymentHistorySummaryCard } from "./components/PaymentHistorySummaryCard";
import { PaymentHistoryActions } from "./components/PaymentHistoryActions";
import { PaymentHistoryTable } from "./components/PaymentHistoryTable";
import { PaymentHistoryCardList } from "./components/PaymentHistoryCardList";
import { PaymentHistoryPagination } from "./components/PaymentHistoryPagination";
import { PaymentHistoryFilterModal } from "./components/modals/PaymentHistoryFilterModal";
import { PaymentHistoryViewModal } from "./components/modals/PaymentHistoryViewModal";
import { PaymentHistoryFormModal } from "./components/modals/PaymentHistoryFormModal";
import { PaymentHistoryDeleteModal } from "./components/modals/PaymentHistoryDeleteModal";

const PaymentHistoryPage = () => {
  const { t } = useTranslation();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = usePaymentHistoryFilters();
  const { payments, totalAmount, loading, error, pagination } = usePaymentHistoryData(filters, page, refreshKey, sortConfig);
  const { formData, updateField, resetForm, setFormFromPayment } = usePaymentHistoryForm();

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

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromPayment(item);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleEditSave = async () => {
    try {
      if (selectedItem) {
        await updatePaymentHistory(selectedItem.id, formData);
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating payment history:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedItem) {
        await deletePaymentHistory(selectedItem.id);
        setDeleteOpen(false);
        setSelectedItem(null);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting payment history:", error);
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
      <PaymentHistoryHeader />
      <PaymentHistorySummaryCard totalAmount={totalAmount} />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <PaymentHistoryActions onFilterClick={() => setFilterOpen(true)} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("paymentHistory.actions.loading")}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="small" className="text-red-600 dark:text-red-400">
                {t("paymentHistory.error.loading")}: {error}
              </Typography>
            </div>
          ) : (
            <>
              <PaymentHistoryTable 
                payments={payments} 
                onView={openViewModal} 
                onEdit={openEditModal} 
                onDelete={openDeleteModal}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />
              <PaymentHistoryCardList payments={payments} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
              <PaymentHistoryPagination
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
      <PaymentHistoryFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <PaymentHistoryFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title={t("paymentHistory.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
      />

      <PaymentHistoryViewModal open={viewOpen} onClose={() => setViewOpen(false)} payment={selectedItem} />

      <PaymentHistoryDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedItem(null);
        }}
        payment={selectedItem}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default PaymentHistoryPage;
