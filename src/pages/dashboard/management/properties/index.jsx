import React, { useState, useMemo, useEffect } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

import { usePropertiesData } from "./hooks/usePropertiesData";
import { usePropertiesForm } from "./hooks/usePropertiesForm";

import { PropertiesHeader } from "./components/PropertiesHeader";
import { PropertiesActions } from "./components/PropertiesActions";
import { PropertiesFloorView } from "./components/PropertiesFloorView";
import { PropertiesTable } from "./components/PropertiesTable";

import { PropertiesFormModal } from "./components/modals/PropertiesFormModal";
import { PropertiesDeleteModal } from "./components/modals/PropertiesDeleteModal";
import { PropertiesViewModal } from "./components/modals/PropertiesViewModal";

import DynamicToast from "@/components/DynamicToast";
import { useManagement } from "@/context/ManagementContext";

import mtkAPI from "../mtk/api";
import complexAPI from "../complex/api";
import buildingAPI from "../buildings/api";
import blockAPI from "../blocks/api";

import propertiesAPI from "./api";

function PropertiesPage() {
  const { t } = useTranslation();
  const { state, actions } = useManagement();

  const [search, setSearch] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [sortAscending, setSortAscending] = useState(true);
  const [viewMode, setViewMode] = useState("floor"); // "floor" | "table"
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const [loadingMtks, setLoadingMtks] = useState(false);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  // Properties yalnız bütün lookup data-lar yükləndikdən sonra yüklənir
  const shouldLoadProperties = 
    !loadingMtks && 
    !loadingComplexes && 
    !loadingBuildings && 
    !loadingBlocks && 
    mtks.length > 0 && 
    complexes.length > 0 && 
    buildings.length > 0 && 
    blocks.length > 0;
  
  const { organizedData, loading, refresh, items } = usePropertiesData({
    search,
    mtkId: state.mtkId,
    complexId: state.complexId,
    buildingId: state.buildingId,
    blockId: state.blockId,
    sortAscending,
    enabled: shouldLoadProperties, // Properties yalnız lookup data-lar hazır olduqda yüklənir
  });

  const form = usePropertiesForm();

  // MTK - bütün səhifələr
  const loadAllMtks = async () => {
    setLoadingMtks(true);
    try {
      let page = 1;
      let lastPage = 1;
      const all = [];

      do {
        const res = await mtkAPI.getAll({ page });
        const data = res?.data;
        const list = data?.data || [];
        lastPage = data?.last_page || 1;

        all.push(...list);
        page += 1;
      } while (page <= lastPage);

      setMtks(all);
      
      // MTK-lar yükləndikdən sonra default olaraq 1-ci MTK seç
      if (all.length > 0 && !state.mtkId) {
        actions.setMtk(all[0].id, all[0]);
      }
    } catch (e) {
      console.error("mtk select load error:", e);
      setMtks([]);
    } finally {
      setLoadingMtks(false);
    }
  };

  // Complex - bütün səhifələr
  const loadAllComplexes = async () => {
    // MTK-lar yüklənib bitməyibsə və ya data yoxdursa gözlə
    if (loadingMtks || mtks.length === 0) {
      return;
    }
    
    setLoadingComplexes(true);
    try {
      let page = 1;
      let lastPage = 1;
      const all = [];

      do {
        const res = await complexAPI.getAll({ page });
        const data = res?.data;
        const list = data?.data || [];
        lastPage = data?.last_page || 1;

        all.push(...list);
        page += 1;
      } while (page <= lastPage);

      setComplexes(all);
      
      // Komplekslər yükləndikdən sonra, seçilmiş MTK-ya uyğun kompleksləri filter et
      const selectedMtkId = state.mtkId;
      if (selectedMtkId && all.length > 0) {
        const filtered = all.filter((c) => {
          const mtkId = c?.mtk_id ?? c?.bind_mtk?.id ?? null;
          return String(mtkId || "") === String(selectedMtkId);
        });
        
        // Default olaraq 1-ci kompleks seç
        if (filtered.length > 0 && !state.complexId) {
          actions.setComplex(filtered[0].id, filtered[0]);
        }
      }
    } catch (e) {
      console.error("complex select load error:", e);
      setComplexes([]);
    } finally {
      setLoadingComplexes(false);
    }
  };

  // Buildings - bütün səhifələr
  const loadAllBuildings = async () => {
    // Komplekslər yüklənib bitməyibsə və ya data yoxdursa gözlə
    if (loadingMtks || loadingComplexes || mtks.length === 0 || complexes.length === 0) {
      return;
    }
    
    setLoadingBuildings(true);
    try {
      let page = 1;
      let lastPage = 1;
      const all = [];

      do {
        const res = await buildingAPI.getAll({ page });
        const data = res?.data;
        const list = data?.data || [];
        lastPage = data?.last_page || 1;

        all.push(...list);
        page += 1;
      } while (page <= lastPage);

      setBuildings(all);
      
      // Binələr yükləndikdən sonra, seçilmiş kompleksə uyğun binələri filter et
      const selectedComplexId = state.complexId;
      if (selectedComplexId && all.length > 0) {
        const filtered = all.filter((b) => {
          const complexId = b?.complex_id ?? b?.complex?.id ?? null;
          return String(complexId || "") === String(selectedComplexId);
        });
        
        // Default olaraq 1-ci bina seç
        if (filtered.length > 0 && !state.buildingId) {
          actions.setBuilding(filtered[0].id, filtered[0]);
        }
      }
    } catch (e) {
      console.error("buildings select load error:", e);
      setBuildings([]);
    } finally {
      setLoadingBuildings(false);
    }
  };

  // Blocks - bütün səhifələr
  const loadAllBlocks = async () => {
    // Binələr yüklənib bitməyibsə və ya data yoxdursa gözlə
    if (loadingMtks || loadingComplexes || loadingBuildings || mtks.length === 0 || complexes.length === 0 || buildings.length === 0) {
      return;
    }
    
    setLoadingBlocks(true);
    try {
      let page = 1;
      let lastPage = 1;
      const all = [];

      do {
        const res = await blockAPI.getAll({ page });
        // blockAPI.getAll() artıq response.data qaytarır
        // res = { success: true, data: { current_page: 1, data: [...], last_page: 1 } }
        
        
        let responseData = res;
        
        // Əgər success: true formatındadırsa
        if (responseData?.success && responseData?.data) {
          responseData = responseData.data;
        } else if (responseData?.data) {
          responseData = responseData.data;
        }
        
        const list = responseData?.data || [];
        lastPage = responseData?.last_page || 1;


        all.push(...list);
        page += 1;
      } while (page <= lastPage);

      setBlocks(all);
      
      // Bloklar yükləndikdən sonra, seçilmiş binəyə uyğun blokları filter et
      const selectedBuildingId = state.buildingId;
      if (selectedBuildingId && all.length > 0) {
        const filtered = all.filter((bl) => {
          const buildingId = bl?.building_id ?? bl?.building?.id ?? null;
          return String(buildingId || "") === String(selectedBuildingId);
        });
        
        // Default olaraq 1-ci blok seç
        if (filtered.length > 0 && !state.blockId) {
          actions.setBlock(filtered[0].id, filtered[0]);
        }
      }
    } catch (e) {
      console.error("blocks select load error:", e);
      setBlocks([]);
    } finally {
      setLoadingBlocks(false);
    }
  };

  // Sequential loading: MTK -> Complex -> Building -> Block
  useEffect(() => {
    loadAllMtks();
  }, []);

  // MTK-lar yükləndikdən sonra komplekslər yüklənir
  useEffect(() => {
    if (!loadingMtks && mtks.length > 0) {
      loadAllComplexes();
    }
  }, [loadingMtks, mtks.length, state.mtkId]);

  // Komplekslər yükləndikdən sonra binələr yüklənir
  useEffect(() => {
    if (!loadingMtks && !loadingComplexes && complexes.length > 0) {
      loadAllBuildings();
    }
  }, [loadingMtks, loadingComplexes, complexes.length, state.complexId]);

  // Binələr yükləndikdən sonra bloklar yüklənir
  useEffect(() => {
    if (!loadingMtks && !loadingComplexes && !loadingBuildings && buildings.length > 0) {
      loadAllBlocks();
    }
  }, [loadingMtks, loadingComplexes, loadingBuildings, buildings.length, state.buildingId]);

  // ✅ table üçün flat data
  const flatProperties = useMemo(
    () => organizedData.flatMap((floorGroup) => floorGroup.apartments || []),
    [organizedData]
  );

  const pageTitleRight = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 text-xs text-blue-gray-400 dark:text-gray-400">
          <Spinner className="h-4 w-4" />
          Yüklənir...
        </div>
      );
    }
    return <div className="text-xs text-blue-gray-400 dark:text-gray-400">Cəm: {flatProperties.length}</div>;
  }, [loading, flatProperties.length]);

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    form.resetForm();

    // scope-dan default block
    if (state.blockId) form.updateField("block_id", state.blockId);

    setFormOpen(true);
  };

  const openEdit = (x) => {
    setMode("edit");
    setSelected(x);
    form.setFormFromProperty(x);
    setFormOpen(true);
  };

  const openView = (x) => {
    setSelected(x);
    setViewOpen(true);
  };

  const openDelete = (x) => {
    setSelected(x);
    setDeleteOpen(true);
  };

  const submitForm = async (payload) => {
    try {
      if (mode === "edit" && selected?.id) {
        await propertiesAPI.update(selected.id, payload);
        showToast("success", "Mənzil uğurla yeniləndi", "Uğurlu");
      } else {
        await propertiesAPI.create(payload);
        showToast("success", "Mənzil uğurla yaradıldı", "Uğurlu");
      }
      await refresh();
      setFormOpen(false);
    } catch (e) {
      console.error(e);
      const errorMessage = e?.response?.data?.message || e?.message || "Xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      throw e;
    }
  };

  const confirmDelete = async (x) => {
    try {
      await propertiesAPI.delete(x.id);
      showToast("success", "Mənzil uğurla silindi", "Uğurlu");
      await refresh();
      setDeleteOpen(false);
    } catch (e) {
      console.error(e);
      const errorMessage = e?.response?.data?.message || e?.message || "Xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      throw e;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <PropertiesHeader />
        {pageTitleRight}
      </div>

      <Card className="shadow-sm dark:bg-gray-800">
        <CardBody className="flex flex-col gap-4">
          <PropertiesActions
            search={search}
            onSearchChange={setSearch}
            onCreateClick={openCreate}
            sortAscending={sortAscending}
            onSortChange={setSortAscending}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            mtks={mtks}
            complexes={complexes}
            buildings={buildings}
            blocks={blocks}
            loadingMtks={loadingMtks}
            loadingComplexes={loadingComplexes}
            loadingBuildings={loadingBuildings}
            loadingBlocks={loadingBlocks}
          />

          {loading || loadingMtks || loadingComplexes || loadingBuildings || loadingBlocks ? (
            <div className="py-10 flex items-center justify-center">
              <Spinner className="h-6 w-6" />
            </div>
          ) : viewMode === "floor" ? (
            <PropertiesFloorView
              organizedData={organizedData}
              loading={loading}
              onEdit={openEdit}
              onView={openView}
              onDelete={openDelete}
            />
          ) : (
            <PropertiesTable
              properties={flatProperties}
              loading={loading}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          )}

          {!loading && flatProperties.length === 0 ? (
            <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">
              Mənzil siyahısı boşdur
            </Typography>
          ) : null}
        </CardBody>
      </Card>

      <PropertiesViewModal open={viewOpen} onClose={() => setViewOpen(false)} item={selected} />

      <PropertiesFormModal
        open={formOpen}
        mode={mode}
        onClose={() => setFormOpen(false)}
        form={form}
        onSubmit={submitForm}
        complexes={complexes}
        buildings={buildings}
        blocks={blocks}
        mtks={mtks}
        loadingMtks={loadingMtks}
        loadingComplexes={loadingComplexes}
        loadingBuildings={loadingBuildings}
        loadingBlocks={loadingBlocks}
      />

      <PropertiesDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        item={selected}
        onConfirm={confirmDelete}
      />

      {/* Toast Notification */}
      <DynamicToast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
        duration={3000}
      />
    </div>
  );
}

export default PropertiesPage;
