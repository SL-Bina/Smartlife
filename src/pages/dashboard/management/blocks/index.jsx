import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography, Alert } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useBlocksData } from "./hooks/useBlocksData";
import { useBlocksFilters } from "./hooks/useBlocksFilters";
import { useBlocksForm } from "./hooks/useBlocksForm";
import { BlocksHeader } from "./components/BlocksHeader";
import { BlocksActions } from "./components/BlocksActions";
import { BlocksTable } from "./components/BlocksTable";
import { BlocksCardList } from "./components/BlocksCardList";
import { BlocksPagination } from "./components/BlocksPagination";
import { BlocksFilterModal } from "./components/modals/BlocksFilterModal";
import { BlocksFormModal } from "./components/modals/BlocksFormModal";
import { blocksAPI } from "./api";

const BlocksPage = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // MTK/Buildings kimi feedback state-ləri
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useBlocksFilters();
  const { blocks, loading, error: dataError, pagination } = useBlocksData(filters, page, refreshKey, sortConfig);
  const { formData, updateField, resetForm, setFormFromBlock } = useBlocksForm();

  useEffect(() => {
    if (page > (pagination.totalPages || 1) && pagination.totalPages > 0) setPage(1);
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

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromBlock(item);
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

      await blocksAPI.create(formData);

      setSuccess(t("blocks.create.success") || "Blok uğurla yaradıldı");
      setCreateOpen(false);
      resetForm();
      setRefreshKey((p) => p + 1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      let errorMessage = t("blocks.create.error") || "Blok yaradılarkən xəta baş verdi";

      if (err?.allErrors && Array.isArray(err.allErrors)) errorMessage = err.allErrors.join(", ");
      else if (err?.errors) errorMessage = Object.values(err.errors).flat().join(", ");
      else if (err?.message) errorMessage = err.message;

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!selectedItem) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await blocksAPI.update(selectedItem.id, formData);

      setSuccess(t("blocks.edit.success") || "Blok uğurla yeniləndi");
      setEditOpen(false);
      setSelectedItem(null);
      resetForm();
      setRefreshKey((p) => p + 1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err?.message || (t("blocks.edit.error") || "Blok yenilənərkən xəta baş verdi");
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const ok = window.confirm(t("blocks.delete.confirm") || `Blok ${item.name} silinsin?`);
    if (!ok) return;

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);

      await blocksAPI.delete(item.id);

      setSuccess(t("blocks.delete.success") || "Blok uğurla silindi");
      setRefreshKey((p) => p + 1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err?.message || (t("blocks.delete.error") || "Blok silinərkən xəta baş verdi");
      setError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= (pagination.totalPages || 1)) setPage(pageNumber);
  };
  const goToPrev = () => page > 1 && setPage((prev) => prev - 1);
  const goToNext = () => page < (pagination.totalPages || 1) && setPage((prev) => prev + 1);

  return (
    <div className="">
      <BlocksHeader />

      {/* MTK/Buildings kimi alert-lər */}
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
        <CardHeader floated={false} shadow={false} color="transparent" className="m-0 flex items-center justify-between p-6 dark:bg-gray-800">
          <BlocksActions onFilterClick={() => setFilterOpen(true)} onCreateClick={openCreateModal} />
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("blocks.loading")}
              </Typography>
            </div>
          ) : (
            <>
              <BlocksTable
                blocks={blocks}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
                deleting={deleting}
              />
              <BlocksCardList blocks={blocks} onView={openViewModal} onEdit={openEditModal} onDelete={handleDelete} deleting={deleting} />
              <BlocksPagination page={page} totalPages={pagination.totalPages} onPageChange={goToPage} onPrev={goToPrev} onNext={goToNext} />
            </>
          )}
        </CardBody>
      </Card>

      <BlocksFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <BlocksFormModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
          setError(null);
        }}
        title={t("blocks.create.title") || "Blok əlavə et"}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
        saving={saving}
      />

      <BlocksFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
          resetForm();
          setError(null);
        }}
        title={t("blocks.edit.title") || "Bloku yenilə"}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
        saving={saving}
      />

      {/* View modal hissəsi səndə hələ implement olunmayıb; istəsən Buildings-dəki kimi ayrıca modal yaza bilərik */}
      {/* viewOpen + selectedItem hazırda saxlanılır */}
    </div>
  );
};

export default BlocksPage;
