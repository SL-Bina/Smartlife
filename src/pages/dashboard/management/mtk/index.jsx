import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { setSelectedMtk, loadMtks, loadMtkById } from "@/store/slices/mtkSlice";
import {
  Actions,
  ENTITY_LEVELS,
  DeleteConfirmModal,
  EditConfirmModal,
  ViewModal,
  Header,
  FormModal,
  SearchModal,
  Table,
  Pagination,
  Skeleton,
} from "@/components/common";
import { useMtkForm } from "@/hooks/management/mtk/useMtkForm";
import { useMtkData } from "@/hooks/management/mtk/useMtkData";
import mtkAPI from "@/services/management/mtkApi";
import DynamicToast from "@/components/DynamicToast";
import { mtkViewFields } from "@/utils/management/mtk/mtkViewFields";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

export default function MtkPage() {
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
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
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

  const handleEditRequest = (formData) => {
    setPendingFormData(formData);
    setEditConfirmOpen(true);
  };

  const confirmEdit = async () => {
    if (!pendingFormData || !selected) return;
    setEditConfirmLoading(true);
    try {
      await mtkAPI.update(selected.id, pendingFormData);
      showToast("success", "MTK uğurla yeniləndi", "Uğurlu");
      dispatch(loadMtks({ page: 1, per_page: 1000 }));
      if (selectedMtkId === selected.id) {
        dispatch(loadMtkById(selected.id));
      }
      refresh();
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
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <Header
        icon={BuildingOfficeIcon}
        title="MTK İdarəetməsi"
        subtitle="MTK siyahısı, yarat / redaktə et / sil / seç"
      />

      <Actions
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

      {loading ? (
        <Skeleton tableRows={6} cardRows={4} />
      ) : (
        <Table
          variant="mtk"
          items={items}
          loading={false}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Pagination
        page={page}
        totalPages={lastPage}
        onPageChange={goToPage}
        summary={<>Cəm: <b>{total}</b> nəticə</>}
        prevLabel="Əvvəlki"
        nextLabel="Növbəti"
        alwaysVisible
        hidePageNumbers
      />

      <FormModal
        variant="mtk"
        open={formOpen}
        mode={mode}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        form={form}
        onSubmit={submitForm}
        onEditRequest={handleEditRequest}
      />

      <SearchModal
        variant="mtk"
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
        fields={mtkViewFields}
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

      <EditConfirmModal
        open={editConfirmOpen}
        onClose={() => {
          setEditConfirmOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmEdit}
        title="MTK-nı Redaktə et"
        itemName={selected ? `"${selected.name}"` : ""}
        entityName="MTK"
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

