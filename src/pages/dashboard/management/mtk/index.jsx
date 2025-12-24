import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
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

const MTK = () => {
  const { t } = useTranslation();
  const { addMtk, updateMtk, deleteMtk, refreshKey } = useManagement();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useMtkFilters();
  const { mtk, loading, pagination } = useMtkData(filters, page, refreshKey);
  const { formData, updateField, resetForm, setFormFromMtk } = useMtkForm();

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

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromMtk(item);
    setEditOpen(true);
  };

  const handleCreateSave = () => {
    addMtk(formData);
    setCreateOpen(false);
    resetForm();
  };

  const handleEditSave = () => {
    if (selectedItem) {
      updateMtk(selectedItem.id, formData);
      setEditOpen(false);
      setSelectedItem(null);
      resetForm();
    }
  };

  const handleDelete = (item) => {
    if (window.confirm(t("mtk.delete.confirm") || `MTK ${item.name} silinsin?`)) {
      deleteMtk(item.id);
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
          ) : (
            <>
              <MtkTable mtk={mtk} onEdit={openEditModal} onDelete={handleDelete} />
              <MtkCardList mtk={mtk} onEdit={openEditModal} onDelete={handleDelete} />
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
        onClose={() => setCreateOpen(false)}
        title={t("mtk.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <MtkFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title={t("mtk.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />
    </div>
  );
};

export default MTK;
