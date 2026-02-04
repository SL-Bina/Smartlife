import React, { useState, useEffect } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useExpenseTypesData } from "./hooks/useExpenseTypesData";
import { useExpenseTypesForm } from "./hooks/useExpenseTypesForm";
import { createExpenseType, updateExpenseType, deleteExpenseType } from "./api";
import { ExpenseTypesHeader } from "./components/ExpenseTypesHeader";
import { ExpenseTypesTable } from "./components/ExpenseTypesTable";
import { ExpenseTypesFormModal } from "./components/modals/ExpenseTypesFormModal";
import { ExpenseTypesViewModal } from "./components/modals/ExpenseTypesViewModal";
import { ExpenseTypesDeleteModal } from "./components/modals/ExpenseTypesDeleteModal";

const ExpenseTypesPage = ({ onClose }) => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const { expenseTypes, loading, error, pagination } = useExpenseTypesData(page, refreshKey, sortConfig);
  const { formData, updateField, resetForm, setFormFromExpenseType } = useExpenseTypesForm();

  useEffect(() => {
    if (page > (pagination.totalPages || 1) && pagination.totalPages > 0) {
      setPage(1);
    }
  }, [pagination.totalPages, page]);

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
    setFormFromExpenseType(item);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      await createExpenseType(formData);
      setCreateOpen(false);
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating expense type:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      if (selectedItem) {
        await updateExpenseType(selectedItem.id, formData);
        setEditOpen(false);
        setSelectedItem(null);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating expense type:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedItem) {
        await deleteExpenseType(selectedItem.id);
        setDeleteOpen(false);
        setSelectedItem(null);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting expense type:", error);
    }
  };

  return (
    <div className="">
      <ExpenseTypesHeader onCreateClick={openCreateModal} onClose={onClose} />

      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("expenseTypes.actions.loading") || "Yüklənir..."}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Typography variant="small" className="text-red-600 dark:text-red-400">
                {t("expenseTypes.error.loading") || "Məlumat yüklənərkən xəta baş verdi"}: {error}
              </Typography>
            </div>
          ) : (
            <ExpenseTypesTable
              expenseTypes={expenseTypes}
              onView={openViewModal}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
            />
          )}
        </CardBody>
      </Card>

      {/* Modals */}
      <ExpenseTypesFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("expenseTypes.create.title") || "Yeni xərc növü əlavə et"}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <ExpenseTypesFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
        }}
        title={t("expenseTypes.edit.title") || "Xərc növü məlumatlarını dəyiş"}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />

      <ExpenseTypesViewModal open={viewOpen} onClose={() => setViewOpen(false)} expenseType={selectedItem} />

      <ExpenseTypesDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedItem(null);
        }}
        expenseType={selectedItem}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ExpenseTypesPage;

