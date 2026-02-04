import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography, Alert } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useManagement } from "@/context";
import { useMtkData } from "./hooks/useMtkData";
import { useMtkFilters } from "./hooks/useMtkFilters";
import { useMtkForm } from "./hooks/useMtkForm";
import { MtkHeader } from "./components/MtkHeader";
import { MtkActions } from "./components/MtkActions";
import { MtkTable } from "./components/MtkTable";
import { MtkCardList } from "./components/MtkCardList";
import { MtkPagination } from "./components/MtkPagination";
import { MtkFilterModal } from "./components/modals/MtkFilterModal";
import { MtkFormModal } from "./components/modals/MtkFormModal";
import { MtkDeleteModal } from "./components/modals/MtkDeleteModal";
import { MtkViewModal } from "./components/modals/MtkViewModal";

const MTK = () => {
  const { t } = useTranslation();
  const { addMtk, updateMtk, deleteMtk, refreshKey } = useManagement();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useMtkFilters();
  const { mtk, loading, error: dataError, pagination } = useMtkData(filters, page, refreshKey, sortConfig);
  const { formData, updateField, resetForm, setFormFromMtk, removePhoto } = useMtkForm();

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
    setSelectedItem(null);
    setCreateOpen(true);
  };

  const openViewModal = (item) => {
    setItemToView(item);
    setViewOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromMtk(item);
    setEditOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await addMtk(formData);
      setSuccess(t("mtk.create.success") || "MTK uğurla yaradıldı");
      setCreateOpen(false);
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Create MTK Error:", err);
      
      // Xəta mesajını formatla
      let errorMessage = t("mtk.create.error") || "MTK yaradılarkən xəta baş verdi";
      
      if (err.allErrors && Array.isArray(err.allErrors)) {
        // Bütün xəta mesajlarını göstər
        errorMessage = err.allErrors.join(", ");
      } else if (err.errors) {
        // Xəta obyektindən mesajları çıxar
        const errorMessages = Object.values(err.errors).flat();
        errorMessage = errorMessages.join(", ");
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (selectedItem) {
      try {
        setSaving(true);
        setError(null);
        setSuccess(null);
        await updateMtk(selectedItem.id, formData);
        setSuccess(t("mtk.edit.success") || "MTK uğurla yeniləndi");
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        const errorMessage = err.message || err.errors || (t("mtk.edit.error") || "MTK yenilənərkən xəta baş verdi");
        setError(errorMessage);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);
      await deleteMtk(itemToDelete.id);
      setSuccess(t("mtk.delete.success") || "MTK uğurla silindi");
      setDeleteOpen(false);
      setItemToDelete(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err.message || (t("mtk.delete.error") || "MTK silinərkən xəta baş verdi");
      setError(errorMessage);
    } finally {
      setDeleting(false);
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
      <MtkHeader />

      {/* Error and Success Messages */}
      {error && (
        <Alert color="red" className="mb-4" onClose={() => setError(null)}>
          {typeof error === "string" ? error : JSON.stringify(error)}
        </Alert>
      )}
      {success && (
        <Alert color="green" className="mb-4" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      {dataError && (
        <Alert color="red" className="mb-4">
          {dataError}
        </Alert>
      )}

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <MtkActions onFilterClick={() => setFilterOpen(true)} onCreateClick={openCreateModal} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("mtk.loading")}
              </Typography>
            </div>
          ) : mtk.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="h6" className="text-blue-gray-400 dark:text-gray-400">
                {t("mtk.noData") || "Məlumat tapılmadı"}
              </Typography>
            </div>
          ) : (
            <>
              <MtkTable 
                mtk={mtk} 
                onView={openViewModal} 
                onEdit={openEditModal} 
                onDelete={handleDelete}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />
              <MtkCardList mtk={mtk} onView={openViewModal} onEdit={openEditModal} onDelete={handleDelete} />
              <MtkPagination
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
      <MtkFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <MtkFormModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setError(null);
          resetForm();
        }}
        title={t("mtk.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
        saving={saving}
        removePhoto={removePhoto}
      />

      <MtkFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
          setError(null);
          resetForm();
        }}
        title={t("mtk.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
        saving={saving}
        removePhoto={removePhoto}
      />

      <MtkDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setItemToDelete(null);
        }}
        mtk={itemToDelete}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />

      <MtkViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setItemToView(null);
        }}
        mtk={itemToView}
        onEdit={openEditModal}
      />
    </div>
  );
};

export default MTK;
