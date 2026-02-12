import React, { useMemo, useState, useEffect } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";

import { BlocksHeader } from "./components/BlocksHeader";
import { BlocksActions } from "./components/BlocksActions";
import { BlocksTable } from "./components/BlocksTable";
import { BlocksPagination } from "./components/BlocksPagination";

import { BlocksViewModal } from "./components/modals/BlocksViewModal";
import { BlocksFormModal } from "./components/modals/BlocksFormModal";
import { BlocksDeleteModal } from "./components/modals/BlocksDeleteModal";
import { BlocksFilterModal } from "./components/modals/BlocksFilterModal";

import { useBlocksData } from "./hooks/useBlocksData";
import { useBlocksForm } from "./hooks/useBlocksForm";
import { useBlocksFilters } from "./hooks/useBlocksFilters";

import { useManagementEnhanced } from "@/store/exports";
import blocksAPI from "./api";
import DynamicToast from "@/components/DynamicToast";

export default function BlocksPage() {
  const [search, setSearch] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const { state, actions } = useManagementEnhanced();

  // Redux-dan məlumatları al
  const mtks = state.mtks || [];
  const complexes = state.complexes || [];
  const buildings = state.buildings || [];
  const loadingMtks = state.loading?.mtks || false;
  const loadingComplexes = state.loading?.complexes || false;
  const loadingBuildings = state.loading?.buildings || false;

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const filters = useBlocksFilters();

  // Blocks data yalnız MTK, Complex və Buildings yükləndikdən sonra yüklənir
  // Amma əgər scope artıq seçilibsə, dərhal yüklə
  const shouldLoadBlocksData = !loadingMtks && !loadingComplexes && !loadingBuildings && 
    (mtks.length > 0 || state.mtkId) && 
    (complexes.length > 0 || state.complexId) && 
    (buildings.length > 0 || state.buildingId);
  
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useBlocksData({
    search,
    mtkId: state.mtkId,
    complexId: state.complexId,
    buildingId: state.buildingId,
    enabled: shouldLoadBlocksData,
    filterStatus: filters.filters.status,
    filterAddress: filters.filters.address,
    filterEmail: filters.filters.email,
    filterPhone: filters.filters.phone
  });

  const form = useBlocksForm();

  const hasActiveFilters = 
    (filters.filters.status && filters.filters.status !== "") ||
    (filters.filters.address && filters.filters.address.trim() !== "") ||
    (filters.filters.email && filters.filters.email.trim() !== "") ||
    (filters.filters.phone && filters.filters.phone.trim() !== "");

  // MTK-lar yükləndikdən sonra default olaraq 1-ci MTK seç
  useEffect(() => {
    if (!loadingMtks && mtks.length > 0 && !state.mtkId) {
      actions.setMtk(mtks[0].id, mtks[0]);
    }
  }, [loadingMtks, mtks.length, state.mtkId, actions]);

  // Complex-lər yükləndikdən sonra default seç
  useEffect(() => {
    if (!loadingComplexes && complexes.length > 0 && state.mtkId && !state.complexId) {
      const filtered = complexes.filter((c) => {
        const complexMtkId = c?.mtk_id ?? c?.bind_mtk?.id ?? null;
        return String(complexMtkId || "") === String(state.mtkId);
      });
      if (filtered.length > 0) {
        actions.setComplex(filtered[0].id, filtered[0]);
      }
    }
  }, [loadingComplexes, complexes.length, state.mtkId, state.complexId, actions]);

  // Buildings yükləndikdən sonra default seç
  useEffect(() => {
    if (!loadingBuildings && buildings.length > 0 && state.complexId && !state.buildingId) {
      const filtered = buildings.filter((b) => {
        const buildingComplexId = b?.complex_id ?? b?.complex?.id ?? null;
        return String(buildingComplexId || "") === String(state.complexId);
      });
      if (filtered.length > 0) {
        actions.setBuilding(filtered[0].id, filtered[0]);
      }
    }
  }, [loadingBuildings, buildings.length, state.complexId, state.buildingId, actions]);

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    form.resetForm();

    // scope-dan default building
    if (state.buildingId) form.updateField("building_id", state.buildingId);

    setFormOpen(true);
  };

  const openEdit = (x) => {
    setMode("edit");
    setSelected(x);
    form.setFormFromBlock(x);
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
        await blocksAPI.update(selected.id, payload);
        showToast("success", "Blok uğurla yeniləndi", "Uğurlu");
      } else {
        await blocksAPI.create(payload);
        showToast("success", "Blok uğurla yaradıldı", "Uğurlu");
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
      await blocksAPI.delete(x.id);
      showToast("success", "Blok uğurla silindi", "Uğurlu");
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
        <BlocksHeader />
      </div>

      <Card className="shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardBody className="flex flex-col gap-6 p-6">
          <BlocksActions
            search={search}
            onSearchChange={setSearch}
            onCreateClick={openCreate}
            mtks={mtks}
            complexes={complexes}
            buildings={buildings}
            loadingMtks={loadingMtks}
            loadingComplexes={loadingComplexes}
            loadingBuildings={loadingBuildings}
            onFilterClick={() => filters.setFilterOpen(true)}
            hasActiveFilters={hasActiveFilters}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />

          <BlocksTable
            items={items}
            loading={loading}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          {!loading && items.length === 0 ? (
            <Typography className="text-sm text-blue-gray-500 dark:text-gray-300 text-center py-4">
              Blok siyahısı boşdur
            </Typography>
          ) : null}

          {!loading && items.length > 0 && (
            <div className="pt-2">
              <BlocksPagination page={page} lastPage={lastPage} onPageChange={goToPage} total={total} />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modals */}
      <BlocksViewModal open={viewOpen} onClose={() => setViewOpen(false)} item={selected} />

      <BlocksFormModal
        open={formOpen}
        mode={mode}
        onClose={() => setFormOpen(false)}
        form={form}
        onSubmit={submitForm}
        complexes={complexes}
        buildings={buildings}
        mtks={mtks}
        loadingMtks={loadingMtks}
        loadingComplexes={loadingComplexes}
        loadingBuildings={loadingBuildings}
      />

      <BlocksDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        item={selected}
        onConfirm={confirmDelete}
      />

      <BlocksFilterModal
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
