import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { setSelectedMtk, loadMtks, loadMtkById } from "@/store/slices/mtkSlice";
import { MtkHeader } from "./components/MtkHeader";
import { MtkActions } from "./components/MtkActions";
import { MtkTable } from "./components/MtkTable";
import { MtkPagination } from "./components/MtkPagination";
import { MtkFormModal } from "./components/modals/MtkFormModal";
import { MtkSearchModal } from "./components/modals/MtkSearchModal";
import { useMtkForm } from "./hooks/useMtkForm";
import { useMtkData } from "./hooks/useMtkData";
import mtkAPI from "./api";
import DynamicToast from "@/components/DynamicToast";

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

  const handleDelete = async (item) => {
    if (!window.confirm(`"${item.name}" MTK-nı silmək istədiyinizə əminsiniz?`)) {
      return;
    }

    try {
      await mtkAPI.delete(item.id);
      showToast("success", "MTK uğurla silindi", "Uğurlu");
      refresh();
      // Reload MTKs in Redux
      dispatch(loadMtks({ page: 1, per_page: 1000 }));
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
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

      <MtkActions
        search={search}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onNameSearchChange={handleNameSearchChange}
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

