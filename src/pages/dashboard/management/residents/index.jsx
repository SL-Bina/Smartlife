import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useResidentsData } from "./hooks/useResidentsData";
import { useResidentsFilters } from "./hooks/useResidentsFilters";
import { useResidentsForm } from "./hooks/useResidentsForm";
import { createResident, updateResident, deleteResident } from "./api";
import { ResidentsHeader } from "./components/ResidentsHeader";
import { ResidentsActions } from "./components/ResidentsActions";
import { ResidentsTable } from "./components/ResidentsTable";
import { ResidentsCardList } from "./components/ResidentsCardList";
import { ResidentsPagination } from "./components/ResidentsPagination";
import { ResidentsFilterModal } from "./components/modals/ResidentsFilterModal";
import { ResidentsFormModal } from "./components/modals/ResidentsFormModal";
import { ResidentsDetailModal } from "./components/modals/ResidentsDetailModal";

const ResidentsPage = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useResidentsFilters();
  const { residents, loading, error, pagination } = useResidentsData(filters, page, refreshKey);
  const { formData, updateField, resetForm, setFormFromResident } = useResidentsForm();

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
    setFormFromResident(item);
    setEditOpen(true);
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      await createResident(formData);
      setCreateOpen(false);
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating resident:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      if (selectedItem) {
        await updateResident(selectedItem.id, formData);
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating resident:", error);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(t("residents.delete.confirm") || `Sakin ${item.fullName} silinsin?`)) {
      try {
        await deleteResident(item.id);
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting resident:", error);
      }
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
      <ResidentsHeader />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <ResidentsActions onFilterClick={() => setFilterOpen(true)} onCreateClick={openCreateModal} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("residents.loading")}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="small" className="text-red-600 dark:text-red-400">
                {t("residents.error.loading")}: {error}
              </Typography>
            </div>
          ) : (
            <>
              <ResidentsTable
                residents={residents}
                onView={openDetailModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
              <ResidentsCardList
                residents={residents}
                onView={openDetailModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
              <ResidentsPagination
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

      <ResidentsFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <ResidentsFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("residents.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <ResidentsFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title={t("residents.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />

      <ResidentsDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        resident={selectedItem}
        onEdit={openEditModal}
      />
    </div>
  );
};

export default ResidentsPage;
