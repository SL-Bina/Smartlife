import React, { useState, useMemo, useEffect } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

import { usePropertiesData } from "./hooks/usePropertiesData";
import { usePropertiesForm } from "./hooks/usePropertiesForm";
import { usePropertiesFilters } from "./hooks/usePropertiesFilters";

import { PropertiesHeader } from "./components/PropertiesHeader";
import { PropertiesActions } from "./components/PropertiesActions";
import { PropertiesFloorView } from "./components/PropertiesFloorView";
import { PropertiesTable } from "./components/PropertiesTable";

import { PropertiesFormModal } from "./components/modals/PropertiesFormModal";
import { PropertiesDeleteModal } from "./components/modals/PropertiesDeleteModal";
import { PropertiesViewModal } from "./components/modals/PropertiesViewModal";
import { PropertiesFilterModal } from "./components/modals/PropertiesFilterModal";

import DynamicToast from "@/components/DynamicToast";
import { useManagementEnhanced } from "@/store/exports";

import mtkAPI from "../mtk/api";
import complexAPI from "../complex/api";
import buildingAPI from "../buildings/api";
import blockAPI from "../blocks/api";

import propertiesAPI from "./api";

function PropertiesPage() {
  const { t } = useTranslation();
  const { state, actions } = useManagementEnhanced();

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

  const filters = usePropertiesFilters();

  // Properties yalnız bütün lookup data-lar yükləndikdən sonra yüklənir
  // Amma əgər scope artıq seçilibsə, dərhal yüklə
  const shouldLoadProperties = 
    !loadingMtks && 
    !loadingComplexes && 
    !loadingBuildings && 
    !loadingBlocks && 
    (mtks.length > 0 || state.mtkId) && 
    (complexes.length > 0 || state.complexId) && 
    (buildings.length > 0 || state.buildingId) && 
    (blocks.length > 0 || state.blockId);
  
  const { organizedData, loading, refresh, items } = usePropertiesData({
    search,
    mtkId: state.mtkId,
    complexId: state.complexId,
    buildingId: state.buildingId,
    blockId: state.blockId,
    sortAscending,
    enabled: shouldLoadProperties,
    filterStatus: filters.filters.status,
    filterNumber: filters.filters.number,
    filterBlock: filters.filters.block,
    filterArea: filters.filters.area
  });

  const form = usePropertiesForm();

  const hasActiveFilters = 
    (filters.filters.status && filters.filters.status !== "") ||
    (filters.filters.number && filters.filters.number.trim() !== "") ||
    (filters.filters.block && filters.filters.block.trim() !== "") ||
    (filters.filters.area && filters.filters.area.trim() !== "");

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
    } catch (e) {
      console.error("complex select load error:", e);
      setComplexes([]);
    } finally {
      setLoadingComplexes(false);
    }
  };

  // Buildings - bütün səhifələr
  const loadAllBuildings = async () => {
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
    } catch (e) {
      console.error("buildings select load error:", e);
      setBuildings([]);
    } finally {
      setLoadingBuildings(false);
    }
  };

  // Blocks - bütün səhifələr
  const loadAllBlocks = async () => {
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
        let responseData = res;
        
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

  useEffect(() => {
    if (!loadingMtks && mtks.length > 0) {
      loadAllComplexes();
    }
  }, [loadingMtks, mtks.length]);

  useEffect(() => {
    if (!loadingMtks && !loadingComplexes && complexes.length > 0) {
      loadAllBuildings();
    }
  }, [loadingMtks, loadingComplexes, complexes.length]);

  useEffect(() => {
    if (!loadingMtks && !loadingComplexes && !loadingBuildings && buildings.length > 0) {
      loadAllBlocks();
    }
  }, [loadingMtks, loadingComplexes, loadingBuildings, buildings.length]);

  // ✅ table üçün flat data
  const flatProperties = useMemo(
    () => organizedData.flatMap((floorGroup) => floorGroup.apartments || []),
    [organizedData]
  );

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

  const handleFilterApply = () => {
    filters.setFilterOpen(false);
    refresh();
  };

  const handleFilterClear = () => {
    filters.clearFilters();
    refresh();
  };

  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-3">
        <PropertiesHeader />
      </div>

      <Card className="shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardBody className="flex flex-col gap-6 p-6">
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
            onFilterClick={() => filters.setFilterOpen(true)}
            hasActiveFilters={hasActiveFilters}
            totalItems={flatProperties.length}
            itemsPerPage={10}
            onItemsPerPageChange={() => {}}
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
            <Typography className="text-sm text-blue-gray-500 dark:text-gray-300 text-center py-4">
              Mənzil siyahısı boşdur
            </Typography>
          ) : null}
        </CardBody>
      </Card>

      {/* Modals */}
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

      <PropertiesFilterModal
        open={filters.filterOpen}
        onClose={() => filters.setFilterOpen(false)}
        filters={filters.filters}
        onFilterChange={filters.setFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
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
