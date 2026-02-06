import React, { useMemo, useState, useEffect } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";

import { BlocksHeader } from "./components/BlocksHeader";
import { BlocksActions } from "./components/BlocksActions";
import { BlocksTable } from "./components/BlocksTable";
import { BlocksPagination } from "./components/BlocksPagination";

import { BlocksViewModal } from "./components/modals/BlocksViewModal";
import { BlocksFormModal } from "./components/modals/BlocksFormModal";
import { BlocksDeleteModal } from "./components/modals/BlocksDeleteModal";

import { useBlocksData } from "./hooks/useBlocksData";
import { useBlocksForm } from "./hooks/useBlocksForm";

import mtkAPI from "../mtk/api";
import complexAPI from "../complex/api";
import buildingAPI from "../buildings/api";

import { useManagement } from "@/context/ManagementContext";
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

  const { state } = useManagement();

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const { items, loading, page, lastPage, goToPage, refresh } = useBlocksData({
    search,
    mtkId: state.mtkId,
    complexId: state.complexId,
    buildingId: state.buildingId,
  });

  const form = useBlocksForm();

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
    } catch (e) {
      console.error("mtk select load error:", e);
      setMtks([]);
    } finally {
      setLoadingMtks(false);
    }
  };

  // Complex - bütün səhifələr
  const loadAllComplexes = async () => {
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

  useEffect(() => {
    loadAllMtks();
    loadAllComplexes();
    loadAllBuildings();
  }, []);

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

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <BlocksHeader />
        {pageTitleRight}
      </div>

      <Card className="shadow-sm dark:bg-gray-800">
        <CardBody className="flex flex-col gap-4">
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
          />

          <BlocksTable
            items={items}
            loading={loading}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          <div className="pt-2">
            <BlocksPagination page={page} lastPage={lastPage} onPageChange={goToPage} />
          </div>

          {!loading && items.length === 0 ? (
            <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">
              Blok siyahısı boşdur
            </Typography>
          ) : null}
        </CardBody>
      </Card>

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
