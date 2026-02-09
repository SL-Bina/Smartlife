import React, { useMemo, useState, useEffect } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";

import { BuildingsHeader } from "./components/BuildingsHeader";
import { BuildingsActions } from "./components/BuildingsActions";
import { BuildingsTable } from "./components/BuildingsTable";
import { BuildingsPagination } from "./components/BuildingsPagination";

import { BuildingViewModal } from "./components/modals/BuildingsViewModal";
import { BuildingFormModal } from "./components/modals/BuildingsFormModal";
import { BuildingDeleteModal } from "./components/modals/BuildingsDeleteModal";
import { BuildingsFilterModal } from "./components/modals/BuildingsFilterModal";

import { useBuildingsData } from "./hooks/useBuildingsData";
import { useBuildingForm } from "./hooks/useBuildingsForm";
import { useBuildingsFilters } from "./hooks/useBuildingsFilters";

import mtkAPI from "../mtk/api";
import complexAPI from "../complex/api";

import { useManagement } from "@/context/ManagementContext";
import buildingAPI from "./api";
import DynamicToast from "@/components/DynamicToast";

export default function BuildingsPage() {
  const [search, setSearch] = useState("");

  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);

  const [loadingMtks, setLoadingMtks] = useState(false);
  const [loadingComplexes, setLoadingComplexes] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const { state, actions } = useManagement();

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const filters = useBuildingsFilters();

  // Buildings data yalnız MTK və Complex yükləndikdən sonra yüklənir
  // Amma əgər MTK və Complex artıq seçilibsə (məsələn Complex səhifəsindən gələndə), dərhal yüklə
  const shouldLoadBuildingsData = !loadingMtks && !loadingComplexes && (mtks.length > 0 || state.mtkId) && (complexes.length > 0 || state.complexId);
  
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useBuildingsData({
    search,
    mtkId: state.mtkId,
    complexId: state.complexId,
    enabled: shouldLoadBuildingsData,
    filterStatus: filters.filters.status,
    filterAddress: filters.filters.address,
    filterEmail: filters.filters.email,
    filterPhone: filters.filters.phone
  });

  const form = useBuildingForm();

  const hasActiveFilters = 
    (filters.filters.status && filters.filters.status !== "") ||
    (filters.filters.address && filters.filters.address.trim() !== "") ||
    (filters.filters.email && filters.filters.email.trim() !== "") ||
    (filters.filters.phone && filters.filters.phone.trim() !== "");

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

  // Complex - bütün səhifələr (actions select üçün)
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

  // Sequential loading: MTK -> Complex
  useEffect(() => {
    loadAllMtks();
  }, []);

  // MTK-lar yükləndikdən sonra komplekslər yüklənir
  useEffect(() => {
    if (!loadingMtks && mtks.length > 0) {
      loadAllComplexes();
    }
  }, [loadingMtks, mtks.length, state.mtkId]);

  const pageTitleRight = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 text-xs text-blue-gray-400 dark:text-gray-400">
          <Spinner className="h-4 w-4" />
          Yüklənir...
        </div>
      );
    }
    return <div className="text-xs text-blue-gray-400 dark:text-gray-400">Cəm: {items.length}</div>;
  }, [loading, items.length]);

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    form.resetForm();

    // scope-dan default complex
    if (state.complexId) form.updateField("complex_id", state.complexId);

    setFormOpen(true);
  };

  const openEdit = (x) => {
    setMode("edit");
    setSelected(x);
    form.setFormFromBuilding(x);
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
        await buildingAPI.update(selected.id, payload);
        showToast("success", "Bina uğurla yeniləndi", "Uğurlu");
      } else {
        await buildingAPI.create(payload);
        showToast("success", "Bina uğurla yaradıldı", "Uğurlu");
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
      await buildingAPI.delete(x.id);
      showToast("success", "Bina uğurla silindi", "Uğurlu");
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
        <BuildingsHeader />
      </div>

      <Card className="shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardBody className="flex flex-col gap-6 p-6">
          <BuildingsActions
            search={search}
            onSearchChange={setSearch}
            onCreateClick={openCreate}
            mtks={mtks}
            complexes={complexes}
            loadingMtks={loadingMtks}
            loadingComplexes={loadingComplexes}
            onFilterClick={() => filters.setFilterOpen(true)}
            hasActiveFilters={hasActiveFilters}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />

          <BuildingsTable
            items={items}
            loading={loading}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          {!loading && items.length === 0 ? (
            <Typography className="text-sm text-blue-gray-500 dark:text-gray-300 text-center py-4">
              Bina siyahısı boşdur
            </Typography>
          ) : null}

          {!loading && items.length > 0 && (
            <div className="pt-2">
              <BuildingsPagination page={page} lastPage={lastPage} onPageChange={goToPage} total={total} />
            </div>
          )}
        </CardBody>
      </Card>

      <BuildingViewModal open={viewOpen} onClose={() => setViewOpen(false)} item={selected} />

      <BuildingFormModal
        open={formOpen}
        mode={mode}
        onClose={() => setFormOpen(false)}
        form={form}
        onSubmit={submitForm}
        complexes={complexes}
        mtks={mtks}
        loadingMtks={loadingMtks}
      />

      <BuildingDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        item={selected}
        onConfirm={confirmDelete}
      />

      <BuildingsFilterModal
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
