import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtkById, setSelectedMtk, loadMtks } from "@/store/slices/mtkSlice";
import { loadComplexById, setSelectedComplex, loadComplexes } from "@/store/slices/complexSlice";
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

export default function BuildingsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  
  // URL-dən complex_id və mtk_id götür
  const urlComplexId = searchParams.get("complex_id");
  const urlMtkId = searchParams.get("mtk_id");
  
  // Redux-dan selected MTK və Complex ID götür
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const selectedBuilding = useAppSelector((state) => state.building.selectedBuilding);
  const mtks = useAppSelector((state) => state.mtk.mtks);
  const complexes = useAppSelector((state) => state.complex.complexes);
  
  // Local state for filter values - immediate update
  const [mtkId, setMtkIdState] = useState(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedMtkId || null;
  });
  
  const [complexId, setComplexIdState] = useState(() => {
    if (urlComplexId) {
      const id = parseInt(urlComplexId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedComplexId || null;
  });
  
  const [search, setSearch] = useState({});
  
  // Sync filter values with URL or Redux changes
  useEffect(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      if (!isNaN(id) && id !== mtkId) setMtkIdState(id);
    } else if (selectedMtkId && selectedMtkId !== mtkId) {
      setMtkIdState(selectedMtkId);
    }
  }, [urlMtkId, selectedMtkId]);

  useEffect(() => {
    if (urlComplexId) {
      const id = parseInt(urlComplexId, 10);
      if (!isNaN(id) && id !== complexId) setComplexIdState(id);
    } else if (selectedComplexId && selectedComplexId !== complexId) {
      setComplexIdState(selectedComplexId);
    }
  }, [urlComplexId, selectedComplexId]);
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useBuildingForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useBuildingData({ search, complexId, mtkId });
  
  // Complex seçim işleminin bir kez yapılması için flag
  const complexInitializedRef = useRef(false);

  // Load MTKs, Complexes and Buildings to Redux on mount
  useEffect(() => {
    dispatch(loadMtks({ page: 1, per_page: 1000 }));
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
    dispatch(loadBuildings({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Load selected Building if ID exists but Building data doesn't
  useEffect(() => {
    if (selectedBuildingId && !selectedBuilding) {
      dispatch(loadBuildingById(selectedBuildingId));
    }
  }, [dispatch, selectedBuildingId, selectedBuilding]);

  // Complex seçim mantığı: URL > Cookie > İlk Complex (sadece bir kez çalışır)
  useEffect(() => {
    // Zaten initialize edildiyse tekrar çalıştırma
    if (complexInitializedRef.current) {
      return;
    }

    // Complex listesi henüz yüklenmediyse bekle
    if (complexes.length === 0) {
      return;
    }

    // 1. URL'de complex_id varsa, onu kullan
    if (urlComplexId) {
      const id = parseInt(urlComplexId, 10);
      if (!isNaN(id)) {
        complexInitializedRef.current = true;
        if (id !== selectedComplexId || !selectedComplex) {
          // Complex'i yüklə və Redux'a kaydet (cookie'ye de yazılacak)
          dispatch(loadComplexById(id)).then((result) => {
            if (result.payload) {
              dispatch(setSelectedComplex({ id, complex: result.payload }));
            }
          });
        }
        return;
      }
    }

    // 2. Cookie'den gelen selectedComplexId varsa, onu kullan
    if (selectedComplexId) {
      complexInitializedRef.current = true;
      if (!selectedComplex) {
        // Complex verisi yoksa yükle
        dispatch(loadComplexById(selectedComplexId)).then((result) => {
          if (result.payload) {
            dispatch(setSelectedComplex({ id: selectedComplexId, complex: result.payload }));
          }
        });
      }
      // URL'i güncelle
      if (!urlComplexId) {
        navigate(`/dashboard/management/buildings?complex_id=${selectedComplexId}`, { replace: true });
      }
      return;
    }

    // 3. Hiçbiri yoksa, ilk Complex'i otomatik seç
    if (complexes.length > 0) {
      const firstComplex = complexes[0];
      if (firstComplex && firstComplex.id) {
        complexInitializedRef.current = true;
        // İlk Complex'i yükle ve seç
        dispatch(loadComplexById(firstComplex.id)).then((result) => {
          if (result.payload) {
            dispatch(setSelectedComplex({ id: firstComplex.id, complex: result.payload }));
            // URL'i de güncelle
            navigate(`/dashboard/management/buildings?complex_id=${firstComplex.id}`, { replace: true });
          }
        });
      }
    }
  }, [urlComplexId, selectedComplexId, selectedComplex, complexes, dispatch, navigate]);

  // MTK seçim mantığı: URL > Cookie
  useEffect(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      if (!isNaN(id) && (id !== selectedMtkId || !selectedMtk)) {
        // MTK'yı yüklə və Redux'a kaydet (cookie'ye de yazılacak)
        dispatch(loadMtkById(id)).then((result) => {
          if (result.payload) {
            dispatch(setSelectedMtk({ id, mtk: result.payload }));
          }
        });
      }
    } else if (selectedMtkId && !urlMtkId) {
      // Cookie'den gelen MTK ID varsa ama URL'de yoksa, URL'i güncelle
      navigate(`/dashboard/management/buildings?mtk_id=${selectedMtkId}`, { replace: true });
    }
  }, [urlMtkId, selectedMtkId, selectedMtk, dispatch, navigate]);

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

  // Vahid filter dəyişikliyi handler
  const handleFilterChange = async (filterType, value, filtersToReset = []) => {
    // Reset edilməli olan filterləri təmizlə
    for (const resetFilter of filtersToReset) {
      switch (resetFilter) {
        case "complex":
          setComplexIdState(null);
          dispatch(setSelectedComplex({ id: null, complex: null }));
          break;
        case "building":
          dispatch(setSelectedBuilding({ id: null, building: null }));
          break;
        default:
          break;
      }
    }

    const params = new URLSearchParams();

    // Əsas filteri dəyiş
    switch (filterType) {
      case "mtk":
        setMtkIdState(value);
        if (value) {
          params.set("mtk_id", value);
          try {
            const result = await dispatch(loadMtkById(value));
            if (result.payload) {
              dispatch(setSelectedMtk({ id: value, mtk: result.payload }));
            }
          } catch (error) {
            console.error("Error loading MTK:", error);
          }
        } else {
          dispatch(setSelectedMtk({ id: null, mtk: null }));
        }
        break;

      case "complex":
        setComplexIdState(value);
        if (mtkId) params.set("mtk_id", mtkId);
        if (value) {
          params.set("complex_id", value);
          try {
            const result = await dispatch(loadComplexById(value));
            if (result.payload) {
              dispatch(setSelectedComplex({ id: value, complex: result.payload }));
            }
          } catch (error) {
            console.error("Error loading Complex:", error);
          }
        } else {
          dispatch(setSelectedComplex({ id: null, complex: null }));
        }
        break;

      default:
        break;
    }

    const queryString = params.toString();
    navigate(`/dashboard/management/buildings${queryString ? `?${queryString}` : ""}`, { replace: true });
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
    // Əgər Complex ID varsa, form-a əlavə et
    if (complexId) {
      form.updateField("complex_id", complexId);
    }
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    form.setFormFromBuilding(item);
    setMode("edit");
    setSelected(item);
    setFormOpen(true);
  };

  const handleSelect = (item) => {
    dispatch(setSelectedBuilding({ id: item.id, building: item }));
    showToast("success", `"${item.name}" Bina seçildi`, "Uğurlu");
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`"${item.name}" Binasını silmək istədiyinizə əminsiniz?`)) {
      return;
    }

    try {
      await buildingsAPI.delete(item.id);
      showToast("success", "Bina uğurla silindi", "Uğurlu");
      refresh();
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
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
    <div className="space-y-6">
      <BuildingHeader />

      <ManagementActions
        entityLevel={ENTITY_LEVELS.BUILDING}
        search={search}
        filterValues={{ mtkId, complexId }}
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

      <BuildingTable
        items={items}
        loading={loading}
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
      />

      <BuildingSearchModal
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

