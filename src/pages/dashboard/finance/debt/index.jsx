import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useDebtData } from "./hooks/useDebtData";
import { useDebtFilters } from "./hooks/useDebtFilters";
import { useDebtForm } from "./hooks/useDebtForm";
import { createDebt, updateDebt, deleteDebt } from "./api";
import { DebtHeader } from "./components/DebtHeader";
import { DebtSummaryCard } from "./components/DebtSummaryCard";
import { DebtActions } from "./components/DebtActions";
import { DebtTable } from "./components/DebtTable";
import { DebtCardList } from "./components/DebtCardList";
import { DebtPagination } from "./components/DebtPagination";
import { DebtFilterModal } from "./components/modals/DebtFilterModal";
import { DebtFormModal } from "./components/modals/DebtFormModal";
import { DebtViewModal } from "./components/modals/DebtViewModal";
import { DebtDeleteModal } from "./components/modals/DebtDeleteModal";

const DebtPage = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useDebtFilters();
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const { debts, totalDebt, loading, error, pagination } = useDebtData(filters, page, refreshKey, sortConfig);
  const { formData, updateField, resetForm, setFormFromDebt } = useDebtForm();

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

  const resetPage = () => {
    setPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    if (page > (pagination.totalPages || 1) && pagination.totalPages > 0) {
      setPage(1);
    }
  }, [pagination.totalPages, page]);


  const handleFilterApply = () => {
    resetPage();
    applyFilters();
  };

  const handleFilterClear = () => {
    clearFilters();
    resetPage();
  };

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
    setPage(1);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromDebt(item);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      await createDebt(formData);
      setCreateOpen(false);
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating debt:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      if (selectedItem) {
        await updateDebt(selectedItem.id, formData);
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating debt:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedItem) {
        await deleteDebt(selectedItem.id);
        setDeleteOpen(false);
        setSelectedItem(null);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting debt:", error);
    }
  };

  return (
    <div className="">
      <DebtHeader />
      <DebtSummaryCard totalDebt={totalDebt} />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <DebtActions onFilterClick={() => setFilterOpen(true)} onCreateClick={openCreateModal} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("debt.actions.loading")}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="small" className="text-red-600 dark:text-red-400">
                {t("debt.error.loading")}: {error}
              </Typography>
            </div>
          ) : (
            <>
              <DebtTable 
                debts={debts} 
                onView={openViewModal} 
                onEdit={openEditModal} 
                onDelete={openDeleteModal}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />
              <DebtCardList debts={debts} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
              <DebtPagination
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
      <DebtFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <DebtFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("debt.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <DebtFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title={t("debt.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />

      <DebtViewModal open={viewOpen} onClose={() => setViewOpen(false)} debt={selectedItem} />

      <DebtDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedItem(null);
        }}
        debt={selectedItem}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default DebtPage;
