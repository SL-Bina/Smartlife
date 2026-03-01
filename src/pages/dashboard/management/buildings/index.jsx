import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtks } from "@/store/slices/mtkSlice";
import { loadComplexes } from "@/store/slices/complexSlice";
import { setSelectedBuilding, loadBuildings, loadBuildingById } from "@/store/slices/buildingSlice";
import { BuildingHeader } from "./components/BuildingHeader";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";
import { BuildingTable } from "./components/BuildingTable";
import { BuildingPagination } from "./components/BuildingPagination";
import { BuildingFormModal } from "./components/modals/BuildingFormModal";
import { BuildingSearchModal } from "./components/modals/BuildingSearchModal";
import { useBuildingForm } from "./hooks/useBuildingForm";
import { useBuildingData } from "./hooks/useBuildingData";
import buildingsAPI from "./api";
import DynamicToast from "@/components/DynamicToast";
import { ViewModal } from "@/components/management/ViewModal";
import { DeleteConfirmModal } from "./components/modals/DeleteConfirmModal";
import { EditConfirmModal } from "./components/modals/EditConfirmModal";
import { BuildingOfficeIcon, CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export default function BuildingsPage() {
  const dispatch = useAppDispatch();
  
  const mtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const complexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const selectedBuilding = useAppSelector((state) => state.building.selectedBuilding);
  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });
  const form = useBuildingForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useBuildingData({ search, complexId, mtkId });

  useEffect(() => {
    dispatch(loadMtks({ page: 1, per_page: 1000 }));
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
    dispatch(loadBuildings({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedBuildingId && !selectedBuilding) {
      dispatch(loadBuildingById(selectedBuildingId));
    }
  }, [dispatch, selectedBuildingId, selectedBuilding]);

  const handleApplyNameSearch = (value) => {
    setSearch((prev) => ({
      ...prev,
      name: value && value.trim() ? value.trim() : undefined,
    }));
  };

  const handleStatusChange = (value) => {
    setSearch((prev) => ({
      ...prev,
      status: value || undefined,
    }));
  };


  const handleRemoveFilter = (filterKey) => {
    setSearch((prev) => {
      const newSearch = { ...prev };
      delete newSearch[filterKey];
      Object.keys(newSearch).forEach((key) => {
        if (!newSearch[key] || (typeof newSearch[key] === 'string' && !newSearch[key].trim())) {
          delete newSearch[key];
        }
      });
      return newSearch;
    });
  };

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    if (complexId) {
      form.updateField("complex_id", complexId);
    }
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleView = async (item) => {
    if (!item?.id) {
      showToast("error", "Bina ID tapılmadı", "Xəta");
      return;
    }

    setViewLoading(true);
    setViewModalOpen(true);
    try {
      const response = await buildingsAPI.getById(item.id);
      const apiData = response?.data?.data || response?.data || response;
      setItemToView(apiData);
    } catch (error) {
      console.error("Error loading Building details:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "Bina məlumatları yüklənərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      setViewModalOpen(false);
      setItemToView(null);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = (item) => {
    form.setFormFromBuilding(item);
    setMode("edit");
    setSelected(item);
    setFormOpen(true);
  };

  const handleEditRequest = (formData) => {
    setPendingFormData(formData);
    setEditConfirmOpen(true);
  };

  const confirmEdit = async () => {
    if (!pendingFormData || !selected) return;
    setEditConfirmLoading(true);
    try {
      await buildingsAPI.update(selected.id, pendingFormData);
      showToast("success", "Bina uğurla yeniləndi", "Uğurlu");
      refresh();
      dispatch(loadBuildings({ page: 1, per_page: 1000 }));
      setEditConfirmOpen(false);
      setPendingFormData(null);
      setFormOpen(false);
      form.resetForm();
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
    } finally {
      setEditConfirmLoading(false);
    }
  };

  const handleSelect = (item) => {
    dispatch(setSelectedBuilding({ id: item.id, building: item }));
    showToast("success", `"${item.name}" Bina seçildi`, "Uğurlu");
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await buildingsAPI.delete(itemToDelete.id);
      showToast("success", "Bina uğurla silindi", "Uğurlu");
      refresh();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const submitForm = async (formData) => {
    try {
      if (mode === "create") {
        await buildingsAPI.add(formData);
        showToast("success", "Bina uğurla əlavə edildi", "Uğurlu");
      } else {
        await buildingsAPI.update(selected.id, formData);
        showToast("success", "Bina uğurla yeniləndi", "Uğurlu");
      }
      refresh();
      form.resetForm();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <BuildingHeader />

      <ManagementActions
        entityLevel={ENTITY_LEVELS.BUILDING}
        search={search}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onRemoveFilter={handleRemoveFilter}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <BuildingTable
        items={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
        selectedBuildingId={selectedBuildingId}
      />

      {lastPage > 1 && (
        <BuildingPagination
          page={page}
          lastPage={lastPage}
          onPageChange={goToPage}
          total={total}
        />
      )}

      <BuildingFormModal
        open={formOpen}
        mode={mode}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        form={form}
        onSubmit={submitForm}
        complexId={complexId}
        mtkId={mtkId}
        onEditRequest={handleEditRequest}
      />

      <BuildingSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={(searchParams) => {
          setSearch((prev) => ({
            ...(prev.name && { name: prev.name }),
            ...(prev.status && { status: prev.status }),
            ...searchParams,
          }));
        }}
        currentSearch={search}
      />

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setItemToView(null);
        }}
        title="Bina Məlumatları"
        item={itemToView}
        entityName="bina"
        loading={viewLoading}
        fields={[
          { key: "name", label: "Ad", icon: BuildingOfficeIcon },
          { 
            key: "complex.name", 
            label: "Complex",
            icon: BuildingOfficeIcon,
            getValue: (item) => item?.complex?.name
          },
          { 
            key: "complex.id", 
            label: "Complex ID",
            icon: BuildingOfficeIcon,
            getValue: (item) => item?.complex?.id
          },
          { 
            key: "meta.desc", 
            label: "Təsvir",
            icon: InformationCircleIcon,
            fullWidth: true,
            getValue: (item) => item?.meta?.desc
          },
          { 
            key: "status", 
            label: "Status",
            icon: CheckCircleIcon
          },
        ]}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Binayı Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="bina"
        loading={deleteLoading}
      />
      <EditConfirmModal
        open={editConfirmOpen}
        onClose={() => {
          setEditConfirmOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmEdit}
        title="Binanı Redaktə et"
        itemName={selected ? `"${selected.name}"` : ""}
        entityName="bina"
        loading={editConfirmLoading}
        oldData={selected}
        newData={pendingFormData}
      />
      <DynamicToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        title={toast.title}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}

