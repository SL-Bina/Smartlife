import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

import { usePropertiesData } from "./hooks/usePropertiesData";
import { usePropertiesFilters } from "./hooks/usePropertiesFilters";
import { usePropertiesForm } from "./hooks/usePropertiesForm";

import { PropertiesHeader } from "./components/PropertiesHeader";
import { PropertiesActions } from "./components/PropertiesActions";
import { PropertiesFloorView } from "./components/PropertiesFloorView";
import { PropertiesTable } from "./components/PropertiesTable";

import { PropertiesFilterModal } from "./components/modals/PropertiesFilterModal";
import { PropertiesFormModal } from "./components/modals/PropertiesFormModal";
import { PropertiesDeleteModal } from "./components/modals/PropertiesDeleteModal";
import { PropertiesViewModal } from "./components/modals/PropertiesViewModal";

import DynamicToast from "@/components/DynamicToast";
import { useDynamicToast } from "@/hooks/useDynamicToast";

import propertiesAPI from "./api";

function PropertiesPage() {
  const { t } = useTranslation();
  const { toast, showToast, closeToast } = useDynamicToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [sortAscending, setSortAscending] = useState(true);

  // ✅ view mode state
  const [viewMode, setViewMode] = useState("floor"); // "floor" | "table"

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { filters, appliedFilters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } =
    usePropertiesFilters();

  const { organizedData, loading, refresh } = usePropertiesData(appliedFilters, sortAscending);

  const { formData, updateField, resetForm, setFormFromProperty } = usePropertiesForm();

  // ✅ table üçün flat data
  const flatProperties = useMemo(
    () => organizedData.flatMap((floorGroup) => floorGroup.apartments || []),
    [organizedData]
  );

  const openCreateModal = () => {
    resetForm();
    setSelectedItem(null);
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromProperty(item);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const handleFilterApply = () => applyFilters();
  const handleFilterClear = () => clearFilters();

  const handleCreateSave = async () => {
    setSaving(true);
    try {
      await propertiesAPI.create(formData);
      setCreateOpen(false);
      resetForm();
      await refresh();

      showToast({
        type: "success",
        title: t("common.success") || "Uğurlu",
        message: t("properties.toast.created") || "Mənzil uğurla yaradıldı",
        duration: 2500,
      });
    } catch (e) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: e?.message || e?.error || (t("common.somethingWentWrong") || "Xəta baş verdi"),
        duration: 3200,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!selectedItem?.id) return;
    setSaving(true);
    try {
      await propertiesAPI.update(selectedItem.id, formData);
      setEditOpen(false);
      setSelectedItem(null);
      resetForm();
      await refresh();

      showToast({
        type: "success",
        title: t("common.success") || "Uğurlu",
        message: t("properties.toast.updated") || "Mənzil uğurla yeniləndi",
      });
    } catch (e) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: e?.message || e?.error || "Xəta baş verdi",
        duration: 3200,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem?.id) return;
    setDeleting(true);
    try {
      await propertiesAPI.delete(selectedItem.id);
      setDeleteOpen(false);
      setSelectedItem(null);
      await refresh();

      showToast({
        type: "success",
        title: t("common.success") || "Uğurlu",
        message: t("properties.toast.deleted") || "Mənzil silindi",
      });
    } catch (e) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: e?.message || e?.error || "Xəta baş verdi",
        duration: 3200,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PropertiesHeader />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <div
          // floated={false}
          // shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800 "
        >

        <PropertiesActions
          onFilterClick={() => setFilterOpen(true)}
          onCreateClick={openCreateModal}
          sortAscending={sortAscending}
          onSortChange={setSortAscending}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filters={filters}
          onFilterChange={updateFilter}
        />
        </div>

        <CardBody className="px-4 pt-4 pb-6 dark:bg-gray-800">
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <Spinner className="h-6 w-6" />
            </div>
          ) : viewMode === "floor" ? (
            <PropertiesFloorView
              organizedData={organizedData}
              onEdit={openEditModal}
              onView={openViewModal}
              onDelete={openDeleteModal}
            />
          ) : (
            <PropertiesTable
              properties={flatProperties}
              onView={openViewModal}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          )}
        </CardBody>

      </Card>

      <PropertiesFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <PropertiesViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />

      <PropertiesFormModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
        }}
        title={t("properties.create.title") || "Mənzil yarat"}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
        saving={saving}
      />

      <PropertiesFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
          resetForm();
        }}
        title={t("properties.edit.title") || "Mənzil dəyiş"}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
        saving={saving}
      />

      <PropertiesDeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />

      <DynamicToast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={toast.duration}
        onClose={closeToast}
      />
    </div>
  );
}

export default PropertiesPage;
