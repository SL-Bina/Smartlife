import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtkById } from "@/store/slices/mtkSlice";
import { setSelectedComplex, loadComplexes, loadComplexById } from "@/store/slices/complexSlice";
import { ComplexHeader } from "./components/ComplexHeader";
import { ComplexActions } from "./components/ComplexActions";
import { ComplexTable } from "./components/ComplexTable";
import { ComplexPagination } from "./components/ComplexPagination";
import { ComplexFormModal } from "./components/modals/ComplexFormModal";
import { ComplexSearchModal } from "./components/modals/ComplexSearchModal";
import { useComplexForm } from "./hooks/useComplexForm";
import { useComplexData } from "./hooks/useComplexData";
import complexesAPI from "./api";
import DynamicToast from "@/components/DynamicToast";

export default function ComplexesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  
  // URL-dən mtk_id götür
  const urlMtkId = searchParams.get("mtk_id");
  
  // Redux-dan selected MTK ID götür
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);
  
  // Redux-dan selected Complex ID götür
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);
  
  // MTK ID-ni təyin et: URL-dən gələn, yoxsa Redux-dan
  const [mtkId, setMtkId] = useState(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedMtkId;
  });
  
  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useComplexForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useComplexData({ search, mtkId });

  // Load Complexes to Redux on mount
  useEffect(() => {
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Redux-da selected MTK ID yoxdursa, sorğu göndər
  useEffect(() => {
    if (selectedMtkId && !selectedMtk) {
      dispatch(loadMtkById(selectedMtkId));
    }
  }, [dispatch, selectedMtkId, selectedMtk]);

  // Load selected Complex if ID exists but Complex data doesn't
  useEffect(() => {
    if (selectedComplexId && !selectedComplex) {
      dispatch(loadComplexById(selectedComplexId));
    }
  }, [dispatch, selectedComplexId, selectedComplex]);

  // URL-dən mtk_id gələndə və ya Redux-da selected MTK ID dəyişəndə
  useEffect(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      if (!isNaN(id)) {
        setMtkId(id);
        dispatch(loadMtkById(id));
      }
    } else if (selectedMtkId) {
      setMtkId(selectedMtkId);
    } else {
      setMtkId(null);
    }
  }, [urlMtkId, selectedMtkId, dispatch]);

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

  const handleMtkChange = (value) => {
    if (value) {
      setMtkId(parseInt(value, 10));
      // URL-i yenilə
      navigate(`/dashboard/management/complexes?mtk_id=${value}`, { replace: true });
    } else {
      setMtkId(null);
      navigate("/dashboard/management/complexes", { replace: true });
    }
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
    // Əgər MTK ID varsa, form-a əlavə et
    if (mtkId) {
      form.updateField("mtk_id", mtkId);
    }
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    form.setFormFromComplex(item);
    setMode("edit");
    setSelected(item);
    setFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`"${item.name}" Complex-i silmək istədiyinizə əminsiniz?`)) {
      return;
    }

    try {
      await complexesAPI.delete(item.id);
      showToast("success", "Complex uğurla silindi", "Uğurlu");
      refresh();
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
    }
  };

  const handleSelect = (item) => {
    dispatch(setSelectedComplex({ id: item.id, complex: item }));
    showToast("success", `"${item.name}" Complex seçildi`, "Uğurlu");
  };

  const handleGoToBuildings = (complexId) => {
    navigate(`/dashboard/management/buildings?complex_id=${complexId}`);
  };

  const submitForm = async (formData) => {
    try {
      if (mode === "create") {
        await complexesAPI.add(formData);
        showToast("success", "Complex uğurla əlavə edildi", "Uğurlu");
      } else {
        await complexesAPI.update(selected.id, formData);
        showToast("success", "Complex uğurla yeniləndi", "Uğurlu");
      }
      refresh();
      form.resetForm();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <ComplexHeader />

      <ComplexActions
        search={search}
        mtkId={mtkId}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onNameSearchChange={handleNameSearchChange}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onMtkChange={handleMtkChange}
        onRemoveFilter={handleRemoveFilter}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <ComplexTable
        items={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGoToBuildings={handleGoToBuildings}
        onSelect={handleSelect}
        selectedComplexId={selectedComplexId}
      />

      {lastPage > 1 && (
        <ComplexPagination
          page={page}
          lastPage={lastPage}
          onPageChange={goToPage}
          total={total}
        />
      )}

      <ComplexFormModal
        open={formOpen}
        mode={mode}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        form={form}
        onSubmit={submitForm}
        mtkId={mtkId}
      />

      <ComplexSearchModal
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

