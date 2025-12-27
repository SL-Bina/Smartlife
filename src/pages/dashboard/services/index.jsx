import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography, Alert } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { servicesAPI } from "./api";
import { useServicesData } from "./hooks/useServicesData";
import { useServicesFilters } from "./hooks/useServicesFilters";
import { useServicesForm } from "./hooks/useServicesForm";
import { ServicesHeader } from "./components/ServicesHeader";
import { ServicesActions } from "./components/ServicesActions";
import { ServicesTable } from "./components/ServicesTable";
import { ServicesCardList } from "./components/ServicesCardList";
import { ServicesPagination } from "./components/ServicesPagination";
import { ServicesFilterModal } from "./components/modals/ServicesFilterModal";
import { ServicesFormModal } from "./components/modals/ServicesFormModal";
import { ServicesDeleteModal } from "./components/modals/ServicesDeleteModal";
import { ServicesViewModal } from "./components/modals/ServicesViewModal";

const ServicesPage = () => {
  const { t } = useTranslation();
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
  const [refreshKey, setRefreshKey] = useState(0);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useServicesFilters();
  const { services, loading, error: dataError, pagination } = useServicesData(filters, page, refreshKey);
  const { formData, updateField, resetForm, setFormFromService } = useServicesForm();

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
    setFormFromService(item);
    setEditOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const response = await servicesAPI.create(formData);
      if (response.success) {
        setSuccess(t("services.create.success") || "Servis uğurla yaradıldı");
        setCreateOpen(false);
        resetForm();
        setRefreshKey((prev) => prev + 1);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Create Service Error:", err);
      
      let errorMessage = t("services.create.error") || "Servis yaradılarkən xəta baş verdi";
      
      if (err.allErrors && Array.isArray(err.allErrors)) {
        errorMessage = err.allErrors.join(", ");
      } else if (err.errors) {
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
        const response = await servicesAPI.update(selectedItem.id, formData);
        if (response.success) {
          setSuccess(t("services.edit.success") || "Servis uğurla yeniləndi");
          setEditOpen(false);
          setSelectedItem(null);
          resetForm();
          setRefreshKey((prev) => prev + 1);
          setTimeout(() => setSuccess(null), 3000);
        }
      } catch (err) {
        const errorMessage = err.message || err.errors || (t("services.edit.error") || "Servis yenilənərkən xəta baş verdi");
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
      const response = await servicesAPI.delete(itemToDelete.id);
      if (response.success) {
        setSuccess(t("services.delete.success") || "Servis uğurla silindi");
        setDeleteOpen(false);
        setItemToDelete(null);
        setRefreshKey((prev) => prev + 1);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      const errorMessage = err.message || (t("services.delete.error") || "Servis silinərkən xəta baş verdi");
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
    <div className="mt-12 mb-8">
      <ServicesHeader />

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
          <ServicesActions onFilterClick={() => setFilterOpen(true)} onCreateClick={openCreateModal} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("services.loading")}
              </Typography>
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="h6" className="text-blue-gray-400 dark:text-gray-400">
                {t("services.noData") || "Məlumat tapılmadı"}
              </Typography>
            </div>
          ) : (
            <>
              <ServicesTable services={services} onView={openViewModal} onEdit={openEditModal} onDelete={handleDelete} />
              <ServicesCardList services={services} onView={openViewModal} onEdit={openEditModal} onDelete={handleDelete} />
              <ServicesPagination
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

      <ServicesFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <ServicesFormModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setError(null);
          resetForm();
        }}
        title={t("services.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
        saving={saving}
      />

      <ServicesFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
          setError(null);
          resetForm();
        }}
        title={t("services.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
        saving={saving}
      />

      <ServicesDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setItemToDelete(null);
        }}
        service={itemToDelete}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />

      <ServicesViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setItemToView(null);
        }}
        service={itemToView}
        onEdit={openEditModal}
      />
    </div>
  );
};

export default ServicesPage;
