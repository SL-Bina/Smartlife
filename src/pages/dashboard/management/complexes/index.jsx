import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtkById, setSelectedMtk, loadMtks } from "@/store/slices/mtkSlice";
import { setSelectedComplex, loadComplexes, loadComplexById } from "@/store/slices/complexSlice";
import { ComplexHeader } from "./components/ComplexHeader";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";
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
  const mtks = useAppSelector((state) => state.mtk.mtks);
  
  // Redux-dan selected Complex ID götür
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);
  
  // Local state for mtkId filter
  const [mtkId, setMtkId] = useState(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedMtkId || null;
  });
  
  const [search, setSearch] = useState({});
  
  // Sync mtkId with URL changes or Redux changes
  useEffect(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      if (!isNaN(id) && id !== mtkId) {
        setMtkId(id);
      }
    } else if (selectedMtkId && selectedMtkId !== mtkId) {
      // URL-də yoxdursa, Redux-dan oxu
      setMtkId(selectedMtkId);
    }
  }, [urlMtkId, selectedMtkId]);
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useComplexForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useComplexData({ search, mtkId });
  
  // MTK seçim işleminin bir kez yapılması için flag
  const mtkInitializedRef = useRef(false);

  // Load MTKs and Complexes to Redux on mount
  useEffect(() => {
    dispatch(loadMtks({ page: 1, per_page: 1000 }));
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Load selected Complex if ID exists but Complex data doesn't
  useEffect(() => {
    if (selectedComplexId && !selectedComplex) {
      dispatch(loadComplexById(selectedComplexId));
    }
  }, [dispatch, selectedComplexId, selectedComplex]);

  // MTK seçim mantığı: URL > Cookie > İlk MTK (sadece bir kez çalışır)
  useEffect(() => {
    // Zaten initialize edildiyse tekrar çalıştırma
    if (mtkInitializedRef.current) {
      return;
    }

    // MTK listesi henüz yüklenmediyse bekle
    if (mtks.length === 0) {
      return;
    }

    // 1. URL'de mtk_id varsa, onu kullan
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      if (!isNaN(id)) {
        mtkInitializedRef.current = true;
        if (id !== selectedMtkId || !selectedMtk) {
          // MTK'yı yüklə və Redux'a kaydet (cookie'ye de yazılacak)
          dispatch(loadMtkById(id)).then((result) => {
            if (result.payload) {
              dispatch(setSelectedMtk({ id, mtk: result.payload }));
            }
          });
        }
        return;
      }
    }

    // 2. Cookie'den gelen selectedMtkId varsa, onu kullan
    if (selectedMtkId) {
      mtkInitializedRef.current = true;
      if (!selectedMtk) {
        // MTK verisi yoksa yükle
        dispatch(loadMtkById(selectedMtkId)).then((result) => {
          if (result.payload) {
            dispatch(setSelectedMtk({ id: selectedMtkId, mtk: result.payload }));
          }
        });
      }
      // URL'i güncelle
      if (!urlMtkId) {
        navigate(`/dashboard/management/complexes?mtk_id=${selectedMtkId}`, { replace: true });
      }
      return;
    }

    // 3. Hiçbiri yoksa, ilk MTK'yı otomatik seç
    if (mtks.length > 0) {
      const firstMtk = mtks[0];
      if (firstMtk && firstMtk.id) {
        mtkInitializedRef.current = true;
        // İlk MTK'yı yükle ve seç
        dispatch(loadMtkById(firstMtk.id)).then((result) => {
          if (result.payload) {
            dispatch(setSelectedMtk({ id: firstMtk.id, mtk: result.payload }));
            // URL'i de güncelle
            navigate(`/dashboard/management/complexes?mtk_id=${firstMtk.id}`, { replace: true });
          }
        });
      }
    }
  }, [urlMtkId, selectedMtkId, selectedMtk, mtks, dispatch, navigate]);

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

  // Filter change handler for ManagementActions
  const handleFilterChange = async (filterType, value, filtersToReset = []) => {
    if (filterType === "mtk") {
      // Update local state immediately for instant filter
      setMtkId(value);
      
      if (value) {
        // MTK'yı yüklə və Redux'a kaydet (cookie'ye de yazılacak)
        try {
          const result = await dispatch(loadMtkById(value));
          if (result.payload) {
            dispatch(setSelectedMtk({ id: value, mtk: result.payload }));
          }
        } catch (error) {
          console.error("Error loading MTK:", error);
        }
        
        // URL-i yenilə
        navigate(`/dashboard/management/complexes?mtk_id=${value}`, { replace: true });
      } else {
        // MTK seçimini temizle (cookie'den de silinecek)
        dispatch(setSelectedMtk({ id: null, mtk: null }));
        navigate("/dashboard/management/complexes", { replace: true });
      }
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

      <ManagementActions
        entityLevel={ENTITY_LEVELS.COMPLEX}
        search={search}
        filterValues={{ mtkId }}
        onFilterChange={handleFilterChange}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
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

