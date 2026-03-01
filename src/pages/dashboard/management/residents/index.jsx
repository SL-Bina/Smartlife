import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedResident, loadResidentById } from "@/store/slices/residentSlice";
import { ResidentHeader } from "./components/ResidentHeader";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";
import { ResidentTable } from "./components/ResidentTable";
import { ResidentPagination } from "./components/ResidentPagination";
import { ResidentFormModal } from "./components/modals/ResidentFormModal";
import { ResidentSearchModal } from "./components/modals/ResidentSearchModal";
import { useResidentForm } from "./hooks/useResidentForm";
import { useResidentData } from "./hooks/useResidentData";
import residentsAPI from "./api";
import DynamicToast from "@/components/DynamicToast";
import { ViewModal } from "@/components/management/ViewModal";
import { DeleteConfirmModal } from "@/components/management/DeleteConfirmModal";
import { UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import PropertyBindModal from "./components/modals/PropertyBindModal";

export default function ResidentsPage() {
  const dispatch = useAppDispatch();

  // Read filter values directly from Redux — ManagementActions keeps these in sync
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const selectedBlockId = useAppSelector((state) => state.block.selectedBlockId);
  const selectedPropertyId = useAppSelector((state) => state.property.selectedPropertyId);

  const selectedResidentId = useAppSelector((state) => state.resident.selectedResidentId);
  const selectedResident = useAppSelector((state) => state.resident.selectedResident);

  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bindModalOpen, setBindModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useResidentForm();
  // Pass Redux filter values — they update whenever ManagementActions dropdowns change
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useResidentData({
    search,
    mtkId: selectedMtkId,
    complexId: selectedComplexId,
    buildingId: selectedBuildingId,
    blockId: selectedBlockId,
    propertyId: selectedPropertyId,
  });

  useEffect(() => {
    if (selectedResidentId && !selectedResident) {
      dispatch(loadResidentById(selectedResidentId));
    }
  }, [dispatch, selectedResidentId, selectedResident]);

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

  // Called by ManagementActions reset button — also clears text search state
  const handleResetFilters = () => {
    setSearch({});
  };

  const handleRemoveFilter = (filterKey) => {
    setSearch((prev) => {
      const newSearch = { ...prev };
      delete newSearch[filterKey];
      Object.keys(newSearch).forEach((key) => {
        if (!newSearch[key] || (typeof newSearch[key] === "string" && !newSearch[key].trim())) {
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
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleView = (item) => {
    setItemToView(item);
    setViewModalOpen(true);
  };

  const handleEdit = (item) => {
    form.setFormFromResident(item);
    setMode("edit");
    setSelected(item);
    setFormOpen(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeleteLoading(true);
    try {
      await residentsAPI.delete(itemToDelete.id);
      showToast("success", "Sakin uğurla silindi", "Uğurlu");
      refresh();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelect = (item) => {
    dispatch(setSelectedResident({ id: item.id, resident: item }));
    showToast("success", `"${item.name} ${item.surname}" Sakin seçildi`, "Uğurlu");
  };

  const submitForm = async (formData) => {
    try {
      if (mode === "create") {
        await residentsAPI.add(formData);
        showToast("success", "Sakin uğurla əlavə edildi", "Uğurlu");
      } else {
        await residentsAPI.update(selected.id, formData);
        showToast("success", "Sakin uğurla yeniləndi", "Uğurlu");
      }
      refresh();
      form.resetForm();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <ResidentHeader />

      <ManagementActions
        entityLevel={ENTITY_LEVELS.RESIDENT}
        search={search}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onRemoveFilter={handleRemoveFilter}
        onResetFilters={handleResetFilters}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <ResidentTable
        items={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onBind={(resident) => {
          dispatch(setSelectedResident({ id: resident.id, resident }));
          dispatch(loadResidentById(resident.id));
          setBindModalOpen(true);
        }}
        onDelete={handleDelete}
        onSelect={handleSelect}
        selectedResidentId={selectedResidentId}
      />

      {lastPage > 1 && (
        <ResidentPagination
          page={page}
          lastPage={lastPage}
          onPageChange={goToPage}
          total={total}
        />
      )}

      <ResidentFormModal
        open={formOpen}
        mode={mode}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        form={form}
        onSubmit={submitForm}
        mtkId={selectedMtkId}
        complexId={selectedComplexId}
        propertyId={selectedPropertyId}
      />

      <PropertyBindModal

        open={bindModalOpen}
        onClose={() => setBindModalOpen(false)}
        residentId={selectedResidentId}
        residentProperties={selectedResident?.property_residents}
        onSuccess={() => {
          if (selectedResidentId) {
            dispatch(loadResidentById(selectedResidentId));
          }
        }}
      />

      <ResidentSearchModal
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
        title="Sakin Məlumatları"
        item={itemToView}
        entityName="sakin"
        fields={[
          { key: "name", label: "Ad", icon: UserIcon },
          { key: "surname", label: "Soyad", icon: UserIcon },
          { key: "email", label: "E-mail", icon: EnvelopeIcon },
          { key: "phone", label: "Telefon", icon: PhoneIcon },
          {
            key: "gender",
            label: "Cins",
            icon: UserIcon,
            format: (value) => value === "male" ? "Kişi" : value === "female" ? "Qadın" : value || "-"
          },
          {
            key: "type",
            label: "Tip",
            icon: IdentificationIcon,
            format: (value) => value === "owner" ? "Sahib" : value === "tenant" ? "Kirayəçi" : value || "-"
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
        title="Sakini Sil"
        itemName={itemToDelete ? `"${itemToDelete.name} ${itemToDelete.surname}"` : ""}
        entityName="sakin"
        loading={deleteLoading}
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
