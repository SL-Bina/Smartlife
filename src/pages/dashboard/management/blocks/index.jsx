import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtkById, setSelectedMtk, loadMtks } from "@/store/slices/mtkSlice";
import { loadComplexById, setSelectedComplex, loadComplexes } from "@/store/slices/complexSlice";
import { loadBuildingById, setSelectedBuilding, loadBuildings } from "@/store/slices/buildingSlice";
import { setSelectedBlock, loadBlocks, loadBlockById } from "@/store/slices/blockSlice";
import { BlockHeader } from "./components/BlockHeader";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";
import { BlockTable } from "./components/BlockTable";
import { BlockPagination } from "./components/BlockPagination";
import { BlockFormModal } from "./components/modals/BlockFormModal";
import { BlockSearchModal } from "./components/modals/BlockSearchModal";
import { useBlockForm } from "./hooks/useBlockForm";
import { useBlockData } from "./hooks/useBlockData";
import blocksAPI from "./api";
import DynamicToast from "@/components/DynamicToast";

export default function BlocksPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  
  // URL parametrlərindən gələn ID-lər
  const urlMtkId = searchParams.get("mtk_id");
  const urlComplexId = searchParams.get("complex_id");
  const urlBuildingId = searchParams.get("building_id");

  // Redux-dan selected ID-lər götür
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const selectedBuilding = useAppSelector((state) => state.building.selectedBuilding);
  const selectedBlockId = useAppSelector((state) => state.block.selectedBlockId);
  const selectedBlock = useAppSelector((state) => state.block.selectedBlock);
  const mtks = useAppSelector((state) => state.mtk.mtks);
  const complexes = useAppSelector((state) => state.complex.complexes);
  const buildings = useAppSelector((state) => state.building.buildings);

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
  
  const [buildingId, setBuildingIdState] = useState(() => {
    if (urlBuildingId) {
      const id = parseInt(urlBuildingId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedBuildingId || null;
  });

  const [search, setSearch] = useState({});
  
  // Sync filter values with URL changes
  useEffect(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      if (!isNaN(id) && id !== mtkId) setMtkIdState(id);
    }
    if (urlComplexId) {
      const id = parseInt(urlComplexId, 10);
      if (!isNaN(id) && id !== complexId) setComplexIdState(id);
    }
    if (urlBuildingId) {
      const id = parseInt(urlBuildingId, 10);
      if (!isNaN(id) && id !== buildingId) setBuildingIdState(id);
    }
  }, [urlMtkId, urlComplexId, urlBuildingId]);
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useBlockForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useBlockData({
    search,
    complexId,
    buildingId,
    mtkId,
  });

  // Seçim işlemlerinin bir kez yapılması için flag'ler
  const mtkInitializedRef = useRef(false);
  const complexInitializedRef = useRef(false);
  const buildingInitializedRef = useRef(false);

  // Load MTKs, Complexes, Buildings and Blocks to Redux on mount
  useEffect(() => {
    dispatch(loadMtks({ page: 1, per_page: 1000 }));
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
    dispatch(loadBuildings({ page: 1, per_page: 1000 }));
    dispatch(loadBlocks({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Load selected Block if ID exists but Block data doesn't
  useEffect(() => {
    if (selectedBlockId && !selectedBlock) {
      dispatch(loadBlockById(selectedBlockId));
    }
  }, [dispatch, selectedBlockId, selectedBlock]);

  // MTK Selection Logic: URL > Cookie > First MTK
  useEffect(() => {
    if (mtkInitializedRef.current || mtks.length === 0) return;

    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      if (!isNaN(id)) {
        mtkInitializedRef.current = true;
        if (id !== selectedMtkId || !selectedMtk) {
          dispatch(loadMtkById(id)).then((result) => {
            if (result.payload) dispatch(setSelectedMtk({ id, mtk: result.payload }));
          });
        }
        return;
      }
    }

    if (selectedMtkId) {
      mtkInitializedRef.current = true;
      if (!selectedMtk) {
        dispatch(loadMtkById(selectedMtkId)).then((result) => {
          if (result.payload) dispatch(setSelectedMtk({ id: selectedMtkId, mtk: result.payload }));
        });
      }
      if (!urlMtkId) navigate(`/dashboard/management/blocks?mtk_id=${selectedMtkId}`, { replace: true });
      return;
    }

    if (mtks.length > 0) {
      const firstMtk = mtks[0];
      if (firstMtk && firstMtk.id) {
        mtkInitializedRef.current = true;
        dispatch(loadMtkById(firstMtk.id)).then((result) => {
          if (result.payload) dispatch(setSelectedMtk({ id: firstMtk.id, mtk: result.payload }));
        });
        if (!urlMtkId) navigate(`/dashboard/management/blocks?mtk_id=${firstMtk.id}`, { replace: true });
      }
    }
  }, [urlMtkId, selectedMtkId, selectedMtk, mtks, dispatch, navigate]);

  // Complex Selection Logic: URL > Cookie > First Complex (if MTK is selected)
  useEffect(() => {
    if (complexInitializedRef.current || complexes.length === 0) return;

    const currentMtkId = urlMtkId ? parseInt(urlMtkId, 10) : selectedMtkId;
    const filteredComplexes = currentMtkId
      ? complexes.filter(c => c.bind_mtk?.id === currentMtkId)
      : complexes;

    if (urlComplexId) {
      const id = parseInt(urlComplexId, 10);
      if (!isNaN(id)) {
        complexInitializedRef.current = true;
        if (id !== selectedComplexId || !selectedComplex) {
          dispatch(loadComplexById(id)).then((result) => {
            if (result.payload) dispatch(setSelectedComplex({ id, complex: result.payload }));
          });
        }
        return;
      }
    }

    if (selectedComplexId) {
      complexInitializedRef.current = true;
      if (!selectedComplex) {
        dispatch(loadComplexById(selectedComplexId)).then((result) => {
          if (result.payload) dispatch(setSelectedComplex({ id: selectedComplexId, complex: result.payload }));
        });
      }
      if (!urlComplexId) {
        const params = new URLSearchParams();
        if (currentMtkId) params.set("mtk_id", currentMtkId);
        params.set("complex_id", selectedComplexId);
        navigate(`/dashboard/management/blocks?${params.toString()}`, { replace: true });
      }
      return;
    }

    if (filteredComplexes.length > 0 && currentMtkId) {
      const firstComplex = filteredComplexes[0];
      if (firstComplex && firstComplex.id) {
        complexInitializedRef.current = true;
        dispatch(loadComplexById(firstComplex.id)).then((result) => {
          if (result.payload) dispatch(setSelectedComplex({ id: firstComplex.id, complex: result.payload }));
        });
        if (!urlComplexId) {
          const params = new URLSearchParams();
          params.set("mtk_id", currentMtkId);
          params.set("complex_id", firstComplex.id);
          navigate(`/dashboard/management/blocks?${params.toString()}`, { replace: true });
        }
      }
    }
  }, [urlComplexId, selectedComplexId, selectedComplex, complexes, selectedMtkId, urlMtkId, dispatch, navigate]);

  // Building Selection Logic: URL > Cookie > First Building (if Complex is selected)
  useEffect(() => {
    if (buildingInitializedRef.current || buildings.length === 0) return;

    const currentComplexId = urlComplexId ? parseInt(urlComplexId, 10) : selectedComplexId;
    const filteredBuildings = currentComplexId
      ? buildings.filter(b => b.bind_complex?.id === currentComplexId)
      : buildings;

    if (urlBuildingId) {
      const id = parseInt(urlBuildingId, 10);
      if (!isNaN(id)) {
        buildingInitializedRef.current = true;
        if (id !== selectedBuildingId || !selectedBuilding) {
          dispatch(loadBuildingById(id)).then((result) => {
            if (result.payload) dispatch(setSelectedBuilding({ id, building: result.payload }));
          });
        }
        return;
      }
    }

    if (selectedBuildingId) {
      buildingInitializedRef.current = true;
      if (!selectedBuilding) {
        dispatch(loadBuildingById(selectedBuildingId)).then((result) => {
          if (result.payload) dispatch(setSelectedBuilding({ id: selectedBuildingId, building: result.payload }));
        });
      }
      if (!urlBuildingId) {
        const params = new URLSearchParams();
        if (urlMtkId || selectedMtkId) params.set("mtk_id", urlMtkId || selectedMtkId);
        if (currentComplexId) params.set("complex_id", currentComplexId);
        params.set("building_id", selectedBuildingId);
        navigate(`/dashboard/management/blocks?${params.toString()}`, { replace: true });
      }
      return;
    }

    if (filteredBuildings.length > 0 && currentComplexId) {
      const firstBuilding = filteredBuildings[0];
      if (firstBuilding && firstBuilding.id) {
        buildingInitializedRef.current = true;
        dispatch(loadBuildingById(firstBuilding.id)).then((result) => {
          if (result.payload) dispatch(setSelectedBuilding({ id: firstBuilding.id, building: result.payload }));
        });
        if (!urlBuildingId) {
          const params = new URLSearchParams();
          if (urlMtkId || selectedMtkId) params.set("mtk_id", urlMtkId || selectedMtkId);
          params.set("complex_id", currentComplexId);
          params.set("building_id", firstBuilding.id);
          navigate(`/dashboard/management/blocks?${params.toString()}`, { replace: true });
        }
      }
    }
  }, [urlBuildingId, selectedBuildingId, selectedBuilding, buildings, selectedComplexId, urlComplexId, urlMtkId, selectedMtkId, dispatch, navigate]);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    setMode("create");
    setFormOpen(true);
  };

  const handleEdit = (block) => {
    form.setFormFromBlock(block);
    setMode("edit");
    setFormOpen(true);
  };

  const handleSelect = (item) => {
    dispatch(setSelectedBlock({ id: item.id, block: item }));
    showToast("success", `"${item.name}" Blok seçildi`, "Uğurlu");
  };

  const handleDelete = async (block) => {
    if (!window.confirm(`"${block.name}" blokunu silmək istədiyinizə əminsiniz?`)) {
      return;
    }

    try {
      await blocksAPI.delete(block.id);
      showToast("success", "Blok uğurla silindi", "Uğurlu");
      refresh();
    } catch (error) {
      const errorMessage = error?.message || "Blok silinərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
    }
  };

  const submitForm = async (formData) => {
    try {
      if (mode === "edit") {
        const blockId = form.formData.id || items.find((item) => item.name === formData.name)?.id;
        if (!blockId) {
          throw new Error("Blok ID tapılmadı");
        }
        await blocksAPI.update(blockId, formData);
        showToast("success", "Blok uğurla yeniləndi", "Uğurlu");
      } else {
        await blocksAPI.add(formData);
        showToast("success", "Blok uğurla əlavə edildi", "Uğurlu");
      }
      refresh();
    } catch (error) {
      const errorMessage = error?.message || "Blok yadda saxlanarkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      throw error;
    }
  };

  const handleNameSearchChange = (value) => {
    setSearch((prev) => ({
      ...prev,
      name: value || undefined,
    }));
  };

  const handleApplyNameSearch = (value) => {
    setSearch((prev) => ({
      ...prev,
      name: value || undefined,
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
    // Reset child filters
    filtersToReset.forEach((filter) => {
      switch (filter) {
        case "complex":
          setComplexIdState(null);
          dispatch(setSelectedComplex({ id: null, complex: null }));
          break;
        case "building":
          setBuildingIdState(null);
          dispatch(setSelectedBuilding({ id: null, building: null }));
          break;
      }
    });

    // Build URL params
    const params = new URLSearchParams();
    
    switch (filterType) {
      case "mtk":
        setMtkIdState(value);
        if (value) {
          params.set("mtk_id", value);
          const result = await dispatch(loadMtkById(value));
          if (result.payload) {
            dispatch(setSelectedMtk({ id: value, mtk: result.payload }));
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
          const result = await dispatch(loadComplexById(value));
          if (result.payload) {
            dispatch(setSelectedComplex({ id: value, complex: result.payload }));
          }
        } else {
          dispatch(setSelectedComplex({ id: null, complex: null }));
        }
        break;
      case "building":
        setBuildingIdState(value);
        if (mtkId) params.set("mtk_id", mtkId);
        if (complexId) params.set("complex_id", complexId);
        if (value) {
          params.set("building_id", value);
          const result = await dispatch(loadBuildingById(value));
          if (result.payload) {
            dispatch(setSelectedBuilding({ id: value, building: result.payload }));
          }
        } else {
          dispatch(setSelectedBuilding({ id: null, building: null }));
        }
        break;
    }

    const queryString = params.toString();
    navigate(`/dashboard/management/blocks${queryString ? `?${queryString}` : ""}`, { replace: true });
  };

  const handleRemoveFilter = (key) => {
    setSearch((prev) => {
      const newSearch = { ...prev };
      delete newSearch[key];
      return newSearch;
    });
  };

  return (
    <div className="space-y-6">
      <BlockHeader />

      <ManagementActions
        entityLevel={ENTITY_LEVELS.BLOCK}
        search={search}
        filterValues={{ mtkId, complexId, buildingId }}
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

      <BlockTable
        items={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
        selectedBlockId={selectedBlockId}
      />

      <BlockPagination
        page={page}
        lastPage={lastPage}
        total={total}
        onPageChange={goToPage}
      />

      <BlockFormModal
        open={formOpen}
        mode={mode}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        form={form}
        onSubmit={submitForm}
        complexId={complexId}
        buildingId={buildingId}
        mtkId={mtkId}
      />

      <BlockSearchModal
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

