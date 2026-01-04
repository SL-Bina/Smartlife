import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography, Alert } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useManagement } from "@/context";
import { useBuildingsData } from "./hooks/useBuildingsData";
import { useBuildingsFilters } from "./hooks/useBuildingsFilters";
import { useBuildingsForm } from "./hooks/useBuildingsForm";
import { BuildingsHeader } from "./components/BuildingsHeader";
import { BuildingsActions } from "./components/BuildingsActions";
import { BuildingsTable } from "./components/BuildingsTable";
import { BuildingsCardList } from "./components/BuildingsCardList";
import { BuildingsPagination } from "./components/BuildingsPagination";
import { BuildingsFilterModal } from "./components/modals/BuildingsFilterModal";
import { BuildingsFormModal } from "./components/modals/BuildingsFormModal";
import { BuildingsViewModal } from "./components/modals/BuildingsViewModal";
import { BuildingsDeleteModal } from "./components/modals/BuildingsDeleteModal";

const BuildingsPage = () => {
  const { t } = useTranslation();
  const { addBuilding, updateBuilding, deleteBuilding, refreshKey } = useManagement();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useBuildingsFilters();
  const { buildings, loading, error: dataError, pagination } = useBuildingsData(filters, page, refreshKey);
  const { formData, updateField, resetForm, setFormFromBuilding } = useBuildingsForm();

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
    setSelectedItem(null);
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromBuilding(item);
    setEditOpen(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await addBuilding(formData);
      setSuccess(t("buildings.create.success") || "Bina uğurla yaradıldı");
      setCreateOpen(false);
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Create Building Error:", err);
      
      // Xəta mesajını formatla
      let errorMessage = t("buildings.create.error") || "Bina yaradılarkən xəta baş verdi";
      
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
        await updateBuilding(selectedItem.id, formData);
        setSuccess(t("buildings.edit.success") || "Bina uğurla yeniləndi");
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        const errorMessage = err.message || err.errors || (t("buildings.edit.error") || "Bina yenilənərkən xəta baş verdi");
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
      await deleteBuilding(itemToDelete.id);
      setSuccess(t("buildings.delete.success") || "Bina uğurla silindi");
      setDeleteOpen(false);
      setItemToDelete(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err.message || (t("buildings.delete.error") || "Bina silinərkən xəta baş verdi");
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

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
      <BuildingsHeader />

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
          <BuildingsActions onFilterClick={() => setFilterOpen(true)} onCreateClick={openCreateModal} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("buildings.loading")}
              </Typography>
            </div>
          ) : (
            <>
              <BuildingsTable
                buildings={buildings}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
              <BuildingsCardList
                buildings={buildings}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
              <BuildingsPagination
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

      <BuildingsFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <BuildingsFormModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
          setError(null);
        }}
        title={t("buildings.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
        saving={saving}
      />

      <BuildingsFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
          resetForm();
          setError(null);
        }}
        title={t("buildings.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
        saving={saving}
      />

      {/* View building modal */}
      <BuildingsViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedItem(null);
        }}
        building={selectedItem}
      />

      {/* Delete building modal */}
      <BuildingsDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setItemToDelete(null);
        }}
        building={itemToDelete}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </div>
  );
};

export default BuildingsPage;
