import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useTransfersData } from "./hooks/useTransfersData";
import { useTransfersFilters } from "./hooks/useTransfersFilters";
import { useTransfersForm } from "./hooks/useTransfersForm";
import { createTransfer, updateTransfer, deleteTransfer } from "./api";
import { TransfersHeader } from "./components/TransfersHeader";
import { TransfersSummaryCard } from "./components/TransfersSummaryCard";
import { TransfersActions } from "./components/TransfersActions";
import { TransfersTable } from "./components/TransfersTable";
import { TransfersCardList } from "./components/TransfersCardList";
import { TransfersPagination } from "./components/TransfersPagination";
import { TransfersFilterModal } from "./components/modals/TransfersFilterModal";
import { TransfersFormModal } from "./components/modals/TransfersFormModal";
import { TransfersViewModal } from "./components/modals/TransfersViewModal";
import { TransfersDeleteModal } from "./components/modals/TransfersDeleteModal";

const TransfersPage = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useTransfersFilters();
  const { transfers, totalTransfers, loading, error, pagination } = useTransfersData(filters, page, refreshKey);
  const { formData, updateField, resetForm, setFormFromTransfer } = useTransfersForm();

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
    setFormFromTransfer(item);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      await createTransfer(formData);
      setCreateOpen(false);
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating transfer:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      if (selectedItem) {
        await updateTransfer(selectedItem.id, formData);
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating transfer:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedItem) {
        await deleteTransfer(selectedItem.id);
        setDeleteOpen(false);
        setSelectedItem(null);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting transfer:", error);
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
      <TransfersHeader />
      <TransfersSummaryCard totalTransfers={totalTransfers} />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <TransfersActions onFilterClick={() => setFilterOpen(true)} onCreateClick={openCreateModal} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("transfers.actions.loading")}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="small" className="text-red-600 dark:text-red-400">
                {t("transfers.error.loading")}: {error}
              </Typography>
            </div>
          ) : (
            <>
              <TransfersTable transfers={transfers} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
              <TransfersCardList transfers={transfers} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
              <TransfersPagination
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
      <TransfersFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <TransfersFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("transfers.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <TransfersFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title={t("transfers.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />

      <TransfersViewModal open={viewOpen} onClose={() => setViewOpen(false)} transfer={selectedItem} />

      <TransfersDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedItem(null);
        }}
        transfer={selectedItem}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default TransfersPage;
