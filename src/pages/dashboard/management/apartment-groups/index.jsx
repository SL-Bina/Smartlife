import React, { useState } from "react";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useApartmentGroupsData } from "./hooks/useApartmentGroupsData";
import { useApartmentGroupsFilters } from "./hooks/useApartmentGroupsFilters";
import { useApartmentGroupsForm } from "./hooks/useApartmentGroupsForm";
import { ApartmentGroupsHeader } from "./components/ApartmentGroupsHeader";
import { ApartmentGroupsActions } from "./components/ApartmentGroupsActions";
import { ApartmentGroupsSummary } from "./components/ApartmentGroupsSummary";
import { ApartmentGroupsList } from "./components/ApartmentGroupsList";
import { ApartmentGroupsFilterModal } from "./components/modals/ApartmentGroupsFilterModal";
import { ApartmentGroupsFormModal } from "./components/modals/ApartmentGroupsFormModal";

const ApartmentGroupsPage = () => {
  const { t } = useTranslation();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { filters, filterOpen, setFilterOpen, updateFilter, clearFilters, applyFilters } = useApartmentGroupsFilters();
  const { groups, loading, summary } = useApartmentGroupsData(filters);
  const { formData, updateField, resetForm, setFormFromGroup } = useApartmentGroupsForm();

  const openCreateModal = () => {
    resetForm();
    setSelectedGroup(null);
    setCreateOpen(true);
  };

  const openEditModal = (group) => {
    setSelectedGroup(group);
    setFormFromGroup(group);
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    applyFilters();
  };

  const handleFilterClear = () => {
    clearFilters();
  };

  const handleCreateSave = () => {
    // TODO: API call for creating group
    setCreateOpen(false);
    resetForm();
  };

  const handleEditSave = () => {
    // TODO: API call for updating group
    setEditOpen(false);
    setSelectedGroup(null);
    resetForm();
  };

  return (
    <div className="">
      <ApartmentGroupsHeader />

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <ApartmentGroupsActions
          onFilterClick={() => setFilterOpen(true)}
          onCreateClick={openCreateModal}
          onClear={handleFilterClear}
          filters={filters}
          onFilterChange={updateFilter}
        />
        <ApartmentGroupsSummary
          totalGroups={summary.totalGroups}
          totalApartments={summary.totalApartments}
          occupied={summary.occupied}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Typography variant="small" className="text-blue-gray-400 dark:text-gray-400">
            {t("apartmentGroups.loading")}
          </Typography>
        </div>
      ) : (
        <ApartmentGroupsList groups={groups} onEdit={openEditModal} />
      )}

      <ApartmentGroupsFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

      <ApartmentGroupsFormModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
        }}
        title={t("apartmentGroups.create.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
      />

      <ApartmentGroupsFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedGroup(null);
          resetForm();
        }}
        title={t("apartmentGroups.edit.title")}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
      />
    </div>
  );
};

export default ApartmentGroupsPage;
