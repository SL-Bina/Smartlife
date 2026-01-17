import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useApplicationsListData } from "./hooks/useApplicationsListData";
import { useApplicationsListFilters } from "./hooks/useApplicationsListFilters";
import { useApplicationsListForm } from "./hooks/useApplicationsListForm";
import { createApplication, updateApplication, deleteApplication } from "./api";
import { ApplicationsListHeader } from "./components/ApplicationsListHeader";
import { ApplicationsListActions } from "./components/ApplicationsListActions";
import { ApplicationsListTable } from "./components/ApplicationsListTable";
import { ApplicationsListCardList } from "./components/ApplicationsListCardList";
import { ApplicationsListPagination } from "./components/ApplicationsListPagination";
import { ApplicationsListFilterModal } from "./components/modals/ApplicationsListFilterModal";
import { ApplicationsListCategoryModal } from "./components/modals/ApplicationsListCategoryModal";
import { ApplicationsListPrioritiesModal } from "./components/modals/ApplicationsListPrioritiesModal";
import { ApplicationsListFormModal } from "./components/modals/ApplicationsListFormModal";
import { ApplicationsListViewModal } from "./components/modals/ApplicationsListViewModal";
import { ApplicationsListDeleteModal } from "./components/modals/ApplicationsListDeleteModal";

const ApplicationsListPage = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [prioritiesOpen, setPrioritiesOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useApplicationsListFilters();
  const { applications, totalApplications, loading, error, pagination } = useApplicationsListData(filters, page, refreshKey, sortConfig);
  const { formData, updateField, resetForm, setFormFromApplication } = useApplicationsListForm();

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
    setCreateOpen(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromApplication(item);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      await createApplication(formData);
      setCreateOpen(false);
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      if (selectedItem) {
        await updateApplication(selectedItem.id, formData);
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedItem) {
        await deleteApplication(selectedItem.id);
        setDeleteOpen(false);
        setSelectedItem(null);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting application:", error);
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
      <ApplicationsListHeader />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 mb-6">
        <CardBody className="p-4 dark:bg-gray-800">
          <ApplicationsListActions 
            onFilterClick={() => setFilterOpen(true)} 
            onCreateClick={openCreateModal}
            onCategoryClick={() => setCategoryOpen(true)}
            onPrioritiesClick={() => setPrioritiesOpen(true)}
          />
        </CardBody>
      </Card>

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("applications.list.actions.loading") || "Yüklənir..."}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="small" className="text-red-600 dark:text-red-400">
                {t("applications.list.error.loading") || "Xəta"}: {error}
              </Typography>
            </div>
          ) : (
            <>
              <ApplicationsListTable 
                applications={applications} 
                onView={openViewModal} 
                onEdit={openEditModal} 
                onDelete={openDeleteModal}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />
              <ApplicationsListCardList applications={applications} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
              <ApplicationsListPagination
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
      <ApplicationsListFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <ApplicationsListCategoryModal
        open={categoryOpen}
        onClose={() => setCategoryOpen(false)}
      />

      <ApplicationsListPrioritiesModal
        open={prioritiesOpen}
        onClose={() => setPrioritiesOpen(false)}
      />

      <ApplicationsListFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("applications.list.newApplicationModal.title") || "Yeni müraciət"}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <ApplicationsListFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title={t("applications.list.edit.title") || "Müraciəti redaktə et"}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />

      <ApplicationsListViewModal open={viewOpen} onClose={() => setViewOpen(false)} application={selectedItem} />

      <ApplicationsListDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedItem(null);
        }}
        application={selectedItem}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ApplicationsListPage;
