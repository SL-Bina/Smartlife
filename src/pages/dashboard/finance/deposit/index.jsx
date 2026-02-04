import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useDepositData } from "./hooks/useDepositData";
import { useDepositFilters } from "./hooks/useDepositFilters";
import { useDepositForm } from "./hooks/useDepositForm";
import { createDeposit, updateDeposit, deleteDeposit } from "./api";
import { DepositHeader } from "./components/DepositHeader";
import { DepositSummaryCard } from "./components/DepositSummaryCard";
import { DepositActions } from "./components/DepositActions";
import { DepositTable } from "./components/DepositTable";
import { DepositCardList } from "./components/DepositCardList";
import { DepositPagination } from "./components/DepositPagination";
import { DepositFilterModal } from "./components/modals/DepositFilterModal";
import { DepositFormModal } from "./components/modals/DepositFormModal";
import { DepositViewModal } from "./components/modals/DepositViewModal";
import { DepositDeleteModal } from "./components/modals/DepositDeleteModal";

const DepositPage = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useDepositFilters();
  const { deposits, totalDeposit, loading, error, pagination } = useDepositData(filters, page, refreshKey, sortConfig);
  const { formData, updateField, resetForm, setFormFromDeposit } = useDepositForm();

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
    setFormFromDeposit(item);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      await createDeposit(formData);
      setCreateOpen(false);
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating deposit:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      if (selectedItem) {
        await updateDeposit(selectedItem.id, formData);
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating deposit:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedItem) {
        await deleteDeposit(selectedItem.id);
        setDeleteOpen(false);
        setSelectedItem(null);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting deposit:", error);
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
      <DepositHeader />
      <DepositSummaryCard totalDeposit={totalDeposit} />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <DepositActions onFilterClick={() => setFilterOpen(true)} onCreateClick={openCreateModal} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("deposit.actions.loading")}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="small" className="text-red-600 dark:text-red-400">
                {t("deposit.error.loading")}: {error}
              </Typography>
            </div>
          ) : (
            <>
              <DepositTable 
                deposits={deposits} 
                onView={openViewModal} 
                onEdit={openEditModal} 
                onDelete={openDeleteModal}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />
              <DepositCardList deposits={deposits} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
              <DepositPagination
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
      <DepositFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <DepositFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("deposit.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <DepositFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title={t("deposit.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />

      <DepositViewModal open={viewOpen} onClose={() => setViewOpen(false)} deposit={selectedItem} />

      <DepositDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedItem(null);
        }}
        deposit={selectedItem}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default DepositPage;
