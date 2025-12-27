import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
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

const BlocksPage = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useBlocksFilters();
  const { blocks, loading, pagination } = useBlocksData(filters, page);
  const { formData, updateField, resetForm, setFormFromBlock } = useBlocksForm();

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
    setFormFromBlock(item);
    setEditOpen(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const handleCreateSave = () => {
    // TODO: API call for creating block
    setCreateOpen(false);
    resetForm();
  };

  const handleEditSave = () => {
    // TODO: API call for updating block
    setEditOpen(false);
    setSelectedItem(null);
    resetForm();
  };

  const handleDelete = (item) => {
    if (window.confirm(t("blocks.delete.confirm") || `Blok ${item.name} silinsin?`)) {
      // TODO: API call for deleting block
      console.log("Delete block:", item.id);
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
      <BlocksHeader />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
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
              />
              <BlocksCardList
                blocks={blocks}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
              <BlocksPagination
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
        }}
        title={t("blocks.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <BlocksFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
          resetForm();
        }}
        title={t("blocks.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />
    </div>
  );
};

export default BlocksPage;
