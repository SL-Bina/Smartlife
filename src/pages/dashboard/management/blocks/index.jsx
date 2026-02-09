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

import mtkAPI from "../mtk/api";
import complexAPI from "../complex/api";
import buildingAPI from "../buildings/api";

import { useManagementEnhanced } from "@/context";
import blocksAPI from "./api";
import DynamicToast from "@/components/DynamicToast";

export default function BlocksPage() {
  const [search, setSearch] = useState("");

  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [buildings, setBuildings] = useState([]);

  const [loadingMtks, setLoadingMtks] = useState(false);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const { state, actions } = useManagementEnhanced();

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

  // Sequential loading: MTK -> Complex -> Building
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
