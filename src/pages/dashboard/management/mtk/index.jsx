import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { setSelectedMtk, loadMtks, loadMtkById } from "@/store/slices/mtkSlice";
import { MtkHeader } from "./components/MtkHeader";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";
import { MtkTable } from "./components/MtkTable";
import { MtkPagination } from "./components/MtkPagination";
import { MtkFormModal } from "./components/modals/MtkFormModal";
import { MtkSearchModal } from "./components/modals/MtkSearchModal";
import { useMtkForm } from "./hooks/useMtkForm";
import { useMtkData } from "./hooks/useMtkData";
import mtkAPI from "./api";
import DynamicToast from "@/components/DynamicToast";
import { ViewModal } from "@/components/management/ViewModal";
import { DeleteConfirmModal } from "@/components/management/DeleteConfirmModal";
import { BuildingOfficeIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, InformationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function MtkPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;

  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);

  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useMtkForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useMtkData({ search });

  const handleNameSearchChange = (value) => {
    // Bu funksiya artıq istifadə olunmur, amma uyğunluq üçün saxlanılır
  };

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
      // Boş olanları sil
      Object.keys(newSearch).forEach((key) => {
        if (!newSearch[key] || (typeof newSearch[key] === 'string' && !newSearch[key].trim())) {
          delete newSearch[key];
        }
      });
      return newSearch;
    });
  };

  // Load MTKs to Redux on mount
  useEffect(() => {
    dispatch(loadMtks({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Load selected MTK if ID exists but MTK data doesn't
  useEffect(() => {
    if (selectedMtkId && !selectedMtk) {
      dispatch(loadMtkById(selectedMtkId));
    }
  }, [dispatch, selectedMtkId, selectedMtk]);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleView = async (item) => {
    if (!item?.id) {
      showToast("error", "MTK ID tapılmadı", "Xəta");
      return;
    }

    setViewLoading(true);
    setViewModalOpen(true);
    try {
      const response = await mtkAPI.getById(item.id);
      // API returns { data: { success, message, data } } or { success, message, data }
      const apiData = response?.data?.data || response?.data || response;
      setItemToView(apiData);
    } catch (error) {
      console.error("Error loading MTK details:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "MTK məlumatları yüklənərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      setViewModalOpen(false);
      setItemToView(null);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = (item) => {
    form.setFormFromMtk(item);
    setMode("edit");
    setSelected(item);
    setFormOpen(true);
  };

  const handleSelect = (item) => {
    dispatch(setSelectedMtk({ id: item.id, mtk: item }));
    showToast("success", `"${item.name}" MTK seçildi`, "Uğurlu");
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await mtkAPI.delete(itemToDelete.id);
      showToast("success", "MTK uğurla silindi", "Uğurlu");
      refresh();
      // Reload MTKs in Redux
      dispatch(loadMtks({ page: 1, per_page: 1000 }));
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
        const response = await mtkAPI.add(formData);
        showToast("success", "MTK uğurla əlavə edildi", "Uğurlu");
        // Reload MTKs in Redux
        dispatch(loadMtks({ page: 1, per_page: 1000 }));
      } else {
        await mtkAPI.update(selected.id, formData);
        showToast("success", "MTK uğurla yeniləndi", "Uğurlu");
        // Reload MTKs in Redux and update selected if it's the same
        dispatch(loadMtks({ page: 1, per_page: 1000 }));
        if (selectedMtkId === selected.id) {
          dispatch(loadMtkById(selected.id));
        }
      }
      refresh();
      form.resetForm();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <MtkHeader />

      <ManagementActions
        entityLevel={ENTITY_LEVELS.MTK}
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

      <MtkTable
        items={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
        selectedMtkId={selectedMtkId}
      />

      {lastPage > 1 && (
        <MtkPagination
          page={page}
          lastPage={lastPage}
          onPageChange={goToPage}
          total={total}
        />
      )}

      <MtkFormModal
        open={formOpen}
        mode={mode}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        form={form}
        onSubmit={submitForm}
      />

      <MtkSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={(searchParams) => {
          // Keep name and status from current search, merge with advanced search params
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
        title="MTK Məlumatları"
        item={itemToView}
        entityName="MTK"
        loading={viewLoading}
        fields={[
          { key: "name", label: "Ad", icon: BuildingOfficeIcon },
          { 
            key: "meta.desc", 
            label: "Təsvir",
            icon: InformationCircleIcon,
            fullWidth: true,
            getValue: (item) => item?.meta?.desc
          },
          { 
            key: "meta.address", 
            label: "Ünvan",
            icon: MapPinIcon,
            fullWidth: true,
            getValue: (item) => item?.meta?.address
          },
          { 
            key: "meta.phone", 
            label: "Telefon",
            icon: PhoneIcon,
            getValue: (item) => item?.meta?.phone
          },
          { 
            key: "meta.email", 
            label: "E-mail",
            icon: EnvelopeIcon,
            getValue: (item) => item?.meta?.email
          },
          { 
            key: "meta.website", 
            label: "Website",
            icon: GlobeAltIcon,
            fullWidth: true,
            getValue: (item) => item?.meta?.website
          },
          { 
            key: "meta.lat", 
            label: "Enlik (Lat)",
            icon: MapPinIcon,
            getValue: (item) => item?.meta?.lat
          },
          { 
            key: "meta.lng", 
            label: "Uzunluq (Lng)",
            icon: MapPinIcon,
            getValue: (item) => item?.meta?.lng
          },
          { 
            key: "meta.color_code", 
            label: "Rəng kodu",
            icon: InformationCircleIcon,
            getValue: (item) => item?.meta?.color_code,
            format: (value) => {
              if (!value) return "-";
              return (
                <div className="flex items-center gap-2">
                  <span>{value}</span>
                  <div 
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600" 
                    style={{ backgroundColor: value }}
                  />
                </div>
              );
            }
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
        title="MTK-nı Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="MTK"
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

