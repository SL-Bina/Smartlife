import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Alert,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  SwatchIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useManagement } from "@/context";
import { useComplexData } from "./hooks/useComplexData";
import { useComplexFilters } from "./hooks/useComplexFilters";
import { useComplexForm } from "./hooks/useComplexForm";
import { ComplexHeader } from "./components/ComplexHeader";
import { ComplexActions } from "./components/ComplexActions";
import { ComplexTable } from "./components/ComplexTable";
import { ComplexCardList } from "./components/ComplexCardList";
import { ComplexPagination } from "./components/ComplexPagination";
import { ComplexFilterModal } from "./components/modals/ComplexFilterModal";
import { ComplexFormModal } from "./components/modals/ComplexFormModal";
import { ComplexDeleteModal } from "./components/modals/ComplexDeleteModal";
import { ComplexViewModal } from "./components/modals/ComplexViewModal";

const ComplexPage = () => {
  const { t } = useTranslation();
  const { addComplex, updateComplex, deleteComplex, refreshKey } = useManagement();
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

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useComplexFilters();
  const { complexes, loading, error: dataError, pagination } = useComplexData(filters, page, refreshKey);
  const { formData, updateField, resetForm, setFormFromComplex } = useComplexForm();

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
    setSelectedItem(null);
    setCreateOpen(true);
  };

  const openViewModal = (item) => {
    setItemToView(item);
    setViewOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromComplex(item);
    setEditOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await addComplex(formData);
      setSuccess(t("complexes.create.success") || "Kompleks uğurla yaradıldı");
      setCreateOpen(false);
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Create Complex Error:", err);
      
      // Xəta mesajını formatla
      let errorMessage = t("complexes.create.error") || "Kompleks yaradılarkən xəta baş verdi";
      
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
        await updateComplex(selectedItem.id, formData);
        setSuccess(t("complexes.edit.success") || "Kompleks uğurla yeniləndi");
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        const errorMessage = err.message || err.errors || (t("complexes.edit.error") || "Kompleks yenilənərkən xəta baş verdi");
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
      await deleteComplex(itemToDelete.id);
      setSuccess(t("complexes.delete.success") || "Kompleks uğurla silindi");
      setDeleteOpen(false);
      setItemToDelete(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err.message || (t("complexes.delete.error") || "Kompleks silinərkən xəta baş verdi");
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
      <ComplexHeader />

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

      {/* Filter modal */}
      <ComplexFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      {/* Create complex modal */}
      <ComplexFormModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
          setError(null);
        }}
        title={t("complexes.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
        saving={saving}
      />

      {/* Edit complex modal */}
      <ComplexFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
          resetForm();
          setError(null);
        }}
        title={t("complexes.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
        saving={saving}
      />

      {/* Delete complex modal */}
      <ComplexDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setItemToDelete(null);
        }}
        complex={itemToDelete}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />

      {/* View complex modal */}
      <ComplexViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setItemToView(null);
        }}
        complex={itemToView}
        onEdit={openEditModal}
      />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <ComplexActions onFilterClick={() => setFilterOpen(true)} onCreateClick={openCreateModal} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("complexes.loading")}
              </Typography>
            </div>
          ) : complexes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="h6" className="text-blue-gray-400 dark:text-gray-400">
                {t("complexes.noData") || "Məlumat tapılmadı"}
              </Typography>
            </div>
          ) : (
            <>
              <ComplexTable
                complexes={complexes}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
              <ComplexCardList
                complexes={complexes}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
              <ComplexPagination
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
    </div>
  );
};

export default ComplexPage;
