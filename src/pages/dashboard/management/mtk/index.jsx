import React, { useMemo, useState } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

import { MtkHeader } from "./components/MtkHeader";
import { MtkActions } from "./components/MtkActions";
import { MtkTable } from "./components/MtkTable";
import { MtkPagination } from "./components/MtkPagination";

import { MtkViewModal } from "./components/modals/MtkViewModal";
import { MtkFormModal } from "./components/modals/MtkFormModal";
import { MtkDeleteModal } from "./components/modals/MtkDeleteModal";

import { useMtkData } from "./hooks/useMtkData";
import { useMtkForm } from "./hooks/useMtkForm";
import mtkAPI from "./api";
import DynamicToast from "@/components/DynamicToast";

export default function MtkPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [mode, setMode] = useState("create"); // create | edit
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const { items, loading, page, lastPage, goToPage, refresh } = useMtkData({ search });
  const form = useMtkForm();

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
    setFormOpen(true);
  };

  const openEdit = (x) => {
    setMode("edit");
    setSelected(x);
    form.setFormFromMtk(x);
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
        await mtkAPI.update(selected.id, payload);
        showToast("success", "MTK uğurla yeniləndi", "Uğurlu");
      } else {
        await mtkAPI.create(payload);
        showToast("success", "MTK uğurla yaradıldı", "Uğurlu");
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
      await mtkAPI.delete(x.id);
      showToast("success", "MTK uğurla silindi", "Uğurlu");
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
        <MtkHeader />
        {pageTitleRight}
      </div>

      <Card className="shadow-sm dark:bg-gray-800">
        <CardBody className="flex flex-col gap-4">
          <MtkActions search={search} onSearchChange={setSearch} onCreateClick={openCreate} />

          <MtkTable
            items={items}
            loading={loading}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
            onGoComplex={() => navigate("/dashboard/management/complex")}
          />

          <div className="pt-2">
            <MtkPagination page={page} lastPage={lastPage} onPageChange={goToPage} />
          </div>

          {!loading && items.length === 0 ? (
            <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">MTK siyahısı boşdur</Typography>
          ) : null}
        </CardBody>
      </Card>

      {/* Modals */}
      <MtkViewModal open={viewOpen} onClose={() => setViewOpen(false)} item={selected} />

      <MtkFormModal
        open={formOpen}
        mode={mode}
        onClose={() => setFormOpen(false)}
        form={form}
        onSubmit={submitForm}
      />

      <MtkDeleteModal
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
