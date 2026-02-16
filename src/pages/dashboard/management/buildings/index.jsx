import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtkById } from "@/store/slices/mtkSlice";
import { loadComplexById } from "@/store/slices/complexSlice";
import { setSelectedComplex } from "@/store/slices/complexSlice";
import { setSelectedBuilding, loadBuildings, loadBuildingById } from "@/store/slices/buildingSlice";
import { BuildingHeader } from "./components/BuildingHeader";
import { BuildingActions } from "./components/BuildingActions";
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
  
  // MTK və Complex ID-ni təyin et: URL-dən gələn, yoxsa Redux-dan
  const [mtkId, setMtkId] = useState(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      return !isNaN(id) ? id : selectedMtkId;
    }
    return selectedMtkId;
  });
  const [complexId, setComplexId] = useState(() => {
    if (urlComplexId) {
      const id = parseInt(urlComplexId, 10);
      return !isNaN(id) ? id : selectedComplexId;
    }
    return selectedComplexId;
  });
  
  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useBuildingForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useBuildingData({ search, complexId, mtkId });

  // Redux-da selected MTK ID yoxdursa, sorğu göndər
  useEffect(() => {
    if (selectedMtkId && !selectedMtk) {
      dispatch(loadMtkById(selectedMtkId));
    }
  }, [dispatch, selectedMtkId, selectedMtk]);

  // Load Buildings to Redux on mount
  useEffect(() => {
    dispatch(loadBuildings({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Redux-da selected Complex ID yoxdursa, sorğu göndər
  useEffect(() => {
    if (selectedComplexId && !selectedComplex) {
      dispatch(loadComplexById(selectedComplexId));
    }
  }, [dispatch, selectedComplexId, selectedComplex]);

  // Load selected Building if ID exists but Building data doesn't
  useEffect(() => {
    if (selectedBuildingId && !selectedBuilding) {
      dispatch(loadBuildingById(selectedBuildingId));
    }
  }, [dispatch, selectedBuildingId, selectedBuilding]);

  // URL-dən mtk_id gələndə
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

  // URL-dən complex_id gələndə və ya Redux-da selected Complex ID dəyişəndə
  useEffect(() => {
    if (urlComplexId) {
      const id = parseInt(urlComplexId, 10);
      if (!isNaN(id)) {
        setComplexId(id);
        dispatch(loadComplexById(id));
      }
    } else if (selectedComplexId) {
      setComplexId(selectedComplexId);
    } else {
      setComplexId(null);
    }
  }, [urlComplexId, selectedComplexId, dispatch]);

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
      const id = parseInt(value, 10);
      setMtkId(id);
      // MTK dəyişəndə Complex-i təmizlə
      setComplexId(null);
      navigate(`/dashboard/management/buildings?mtk_id=${id}`, { replace: true });
    } else {
      setMtkId(null);
      setComplexId(null);
      navigate("/dashboard/management/buildings", { replace: true });
    }
  };

  const handleComplexChange = (value) => {
    if (value) {
      const complexIdNum = parseInt(value, 10);
      setComplexId(complexIdNum);
      // Complex-i Redux-a yaz
      const complex = complexes.find(c => c.id === complexIdNum);
      if (complex) {
        dispatch(setSelectedComplex({ id: complexIdNum, complex }));
      }
      navigate(`/dashboard/management/buildings?complex_id=${value}`, { replace: true });
    } else {
      setComplexId(null);
      dispatch(setSelectedComplex({ id: null, complex: null }));
      navigate("/dashboard/management/buildings", { replace: true });
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

  const complexes = useAppSelector((state) => state.complex.complexes);

  return (
    <div className="space-y-6">
      <BuildingHeader />

      <BuildingActions
        search={search}
        mtkId={mtkId}
        complexId={complexId}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onNameSearchChange={handleNameSearchChange}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onMtkChange={handleMtkChange}
        onComplexChange={handleComplexChange}
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

