import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
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

const BuildingsPage = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useBuildingsFilters();
  const { buildings, loading, pagination } = useBuildingsData(filters, page);
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

  const handleCreateSave = () => {
    // TODO: API call for creating building
    setCreateOpen(false);
    resetForm();
  };

  const handleEditSave = () => {
    // TODO: API call for updating building
    setEditOpen(false);
    setSelectedItem(null);
    resetForm();
  };

  const handleDelete = (item) => {
    if (window.confirm(t("buildings.delete.confirm") || `Bina ${item.name} silinsin?`)) {
      // TODO: API call for deleting building
      console.log("Delete building:", item.id);
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
        }}
        title={t("buildings.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <BuildingsFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
          resetForm();
        }}
        title={t("buildings.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />
    </div>
  );
};

export default BuildingsPage;
