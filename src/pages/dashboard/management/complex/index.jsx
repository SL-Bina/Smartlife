import React, { useMemo, useState, useEffect } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

import { ComplexHeader } from "./components/ComplexHeader";
import { ComplexActions } from "./components/ComplexActions";
import { ComplexTable } from "./components/ComplexTable";
import { ComplexPagination } from "./components/ComplexPagination";

import { ComplexViewModal } from "./components/modals/ComplexViewModal";
import { ComplexFormModal } from "./components/modals/ComplexFormModal";
import { ComplexDeleteModal } from "./components/modals/ComplexDeleteModal";

import { useComplexData } from "./hooks/useComplexData";
import { useComplexForm } from "./hooks/useComplexForm";

import complexAPI from "./api";
import mtkAPI from "../mtk/api"; // mövcud mtk api-ni istifadə edirik
import { useManagement } from "@/context/ManagementContext";
import DynamicToast from "@/components/DynamicToast";

export default function ComplexPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [mtks, setMtks] = useState([]);
  const [loadingMtks, setLoadingMtks] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [mode, setMode] = useState("create"); // create | edit
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };



  const { state, actions } = useManagement();

  // Complex data yalnız MTK-lar yükləndikdən sonra yüklənir
  // Amma əgər MTK artıq seçilibsə (məsələn MTK səhifəsindən gələndə), dərhal yüklə
  const shouldLoadComplexData = !loadingMtks && (mtks.length > 0 || state.mtkId);
  
  const { items, loading, page, lastPage, goToPage, refresh } =
    useComplexData({ search, mtkId: state.mtkId, enabled: shouldLoadComplexData });

  const form = useComplexForm();

  // MTK-ları select üçün gətir (bütün səhifələri yığırıq)
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

  useEffect(() => {
    loadAllMtks();
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
    // default mtk_id contextdən
    if (state.mtkId) form.updateField("mtk_id", state.mtkId);
    setFormOpen(true);
  };

  const openEdit = (x) => {
    setMode("edit");
    setSelected(x);
    form.setFormFromComplex(x);
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
        await complexAPI.update(selected.id, payload);
        showToast("success", "Kompleks uğurla yeniləndi", "Uğurlu");
      } else {
        await complexAPI.create(payload);
        showToast("success", "Kompleks uğurla yaradıldı", "Uğurlu");
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
      await complexAPI.delete(x.id);
      showToast("success", "Kompleks uğurla silindi", "Uğurlu");
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
        <ComplexHeader />
        {pageTitleRight}
      </div>

      <Card className="shadow-sm dark:bg-gray-800">
        <CardBody className="flex flex-col gap-4">
          <ComplexActions
            search={search}
            onSearchChange={setSearch}
            onCreateClick={openCreate}
            mtks={mtks}
            loadingMtks={loadingMtks}
          />

          <ComplexTable
            items={items}
            loading={loading}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          <div className="pt-2">
            <ComplexPagination page={page} lastPage={lastPage} onPageChange={goToPage} />
            </div>

          {loading || loadingMtks ? (
            <div className="py-10 flex items-center justify-center">
              <Spinner className="h-6 w-6" />
            </div>
          ) : !loading && items.length === 0 ? (
            <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">
              Kompleks siyahısı boşdur
            </Typography>
          ) : null}
        </CardBody>
      </Card>

      {/* Modals */}
      <ComplexViewModal open={viewOpen} onClose={() => setViewOpen(false)} item={selected} />

      <ComplexFormModal
        open={formOpen}
        mode={mode}
        onClose={() => setFormOpen(false)}
        form={form}
        onSubmit={submitForm}
        mtks={mtks}
      />

      <ComplexDeleteModal
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
