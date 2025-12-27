import React, { useState } from "react";
import { Card, CardHeader, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { usePropertiesData } from "./hooks/usePropertiesData";
import { usePropertiesFilters } from "./hooks/usePropertiesFilters";
import { usePropertiesForm } from "./hooks/usePropertiesForm";
import { PropertiesHeader } from "./components/PropertiesHeader";
import { PropertiesActions } from "./components/PropertiesActions";
import { PropertiesFloorView } from "./components/PropertiesFloorView";
import { PropertiesFilterModal } from "./components/modals/PropertiesFilterModal";
import { PropertiesFormModal } from "./components/modals/PropertiesFormModal";

function PropertiesPage() {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortAscending, setSortAscending] = useState(true); // true = aşağıdan yuxarı, false = yuxarıdan aşağı

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = usePropertiesFilters();
  const { organizedData, loading } = usePropertiesData(filters, sortAscending);
  const { formData, updateField, resetForm, setFormFromProperty } = usePropertiesForm();


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

  const handleFilterApply = () => {
    applyFilters();
  };

  const handleFilterClear = () => {
    clearFilters();
  };

  const handleCreateSave = () => {
    // TODO: API call for creating property
    setCreateOpen(false);
    resetForm();
  };

  const handleEditSave = () => {
    // TODO: API call for updating property
    setEditOpen(false);
    setSelectedItem(null);
    resetForm();
  };

  return (
    <div className="">
      <PropertiesHeader />

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <PropertiesActions
            onFilterClick={() => setFilterOpen(true)}
            onCreateClick={openCreateModal}
            sortAscending={sortAscending}
            onSortChange={setSortAscending}
          />
        </CardHeader>
        <CardBody className="px-4 pt-4 pb-6 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("properties.loading")}
              </Typography>
            </div>
          ) : (
            <PropertiesFloorView organizedData={organizedData} onEdit={openEditModal} />
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

      <PropertiesFormModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
        }}
        title={t("properties.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <PropertiesFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedItem(null);
          resetForm();
        }}
        title={t("properties.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />
    </div>
  );
}

export default PropertiesPage;
