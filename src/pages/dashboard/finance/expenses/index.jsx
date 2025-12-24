import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useExpensesData } from "./hooks/useExpensesData";
import { useExpensesFilters } from "./hooks/useExpensesFilters";
import { useExpensesForm } from "./hooks/useExpensesForm";
import { createExpense, updateExpense, deleteExpense } from "./api";
import { ExpensesHeader } from "./components/ExpensesHeader";
import { ExpensesSummaryCard } from "./components/ExpensesSummaryCard";
import { ExpensesActions } from "./components/ExpensesActions";
import { ExpensesTable } from "./components/ExpensesTable";
import { ExpensesCardList } from "./components/ExpensesCardList";
import { ExpensesPagination } from "./components/ExpensesPagination";
import { ExpensesFilterModal } from "./components/modals/ExpensesFilterModal";
import { ExpensesFormModal } from "./components/modals/ExpensesFormModal";
import { ExpensesViewModal } from "./components/modals/ExpensesViewModal";
import { ExpensesDeleteModal } from "./components/modals/ExpensesDeleteModal";

const ExpensesPage = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useExpensesFilters();
  const { expenses, totalExpenses, loading, error, pagination } = useExpensesData(filters, page, refreshKey);
  const { formData, updateField, resetForm, setFormFromExpense } = useExpensesForm();

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
    setCreateOpen(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromExpense(item);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      await createExpense(formData);
      setCreateOpen(false);
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      if (selectedItem) {
        await updateExpense(selectedItem.id, formData);
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedItem) {
        await deleteExpense(selectedItem.id);
        setDeleteOpen(false);
        setSelectedItem(null);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
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
      <ExpensesHeader />
      <ExpensesSummaryCard totalExpenses={totalExpenses} />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <ExpensesActions onFilterClick={() => setFilterOpen(true)} onCreateClick={openCreateModal} />
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("expenses.actions.loading")}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="small" className="text-red-600 dark:text-red-400">
                {t("expenses.error.loading")}: {error}
              </Typography>
            </div>
          ) : (
            <>
              <ExpensesTable expenses={expenses} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
              <ExpensesCardList expenses={expenses} onView={openViewModal} onEdit={openEditModal} onDelete={openDeleteModal} />
              <ExpensesPagination
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

      <ExpensesFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <ExpensesFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("expenses.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <ExpensesFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title={t("expenses.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />

      <ExpensesViewModal open={viewOpen} onClose={() => setViewOpen(false)} expense={selectedItem} />

      <ExpensesDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedItem(null);
        }}
        expense={selectedItem}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ExpensesPage;
