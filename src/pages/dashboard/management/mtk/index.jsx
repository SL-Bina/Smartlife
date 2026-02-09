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
import { useMtkFilters } from "./hooks/useMtkFilters";
import { MtkFilterModal } from "./components/modals/MtkFilterModal";
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

  const filters = useMtkFilters();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useMtkData({ 
    search,
    filterStatus: filters.filters.status,
    filterAddress: filters.filters.address,
    filterEmail: filters.filters.email,
    filterPhone: filters.filters.phone,
    filterWebsite: filters.filters.website,
    filterColor: filters.filters.color
  });
  const form = useMtkForm();

  const hasActiveFilters = 
    (filters.filters.status && filters.filters.status !== "") ||
    (filters.filters.address && filters.filters.address.trim() !== "") ||
    (filters.filters.email && filters.filters.email.trim() !== "") ||
    (filters.filters.phone && filters.filters.phone.trim() !== "") ||
    (filters.filters.website && filters.filters.website.trim() !== "") ||
    (filters.filters.color && filters.filters.color.trim() !== "");

  const handleFilterApply = () => {
    filters.applyFilters();
    // Filter tətbiq olunduqda məlumatları yenilə
    refresh();
  };

  const handleFilterClear = () => {
    filters.clearFilters();
    // Filter təmizləndikdə məlumatları yenilə
    refresh();
  };

  const pageTitleRight = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 text-xs text-blue-gray-400 dark:text-gray-400">
          <Spinner className="h-4 w-4" />
          Yüklənir...
        </div>
      );
    }
    return <div className="text-xs text-blue-gray-400 dark:text-gray-400">Cəm: {total}</div>;
  }, [loading, total]);

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
    <div className="py-4">
      <div className="flex items-start justify-between gap-3 mb-6">
        <MtkHeader />
        {/* {pageTitleRight} */}
      </div>

      <Card className="shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardBody className="flex flex-col gap-6 p-6">
          <MtkActions
            search={search}
            onSearchChange={setSearch}
            onCreateClick={openCreate}
            onFilterClick={() => filters.setFilterOpen(true)}
            hasActiveFilters={hasActiveFilters}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />

          <MtkTable
            items={items}
            loading={loading}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
            onGoComplex={() => navigate("/dashboard/management/complex")}
          />

          {!loading && items.length > 0 && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <MtkPagination page={page} lastPage={lastPage} total={total} onPageChange={goToPage} />
          </div>
          )}

          {!loading && items.length === 0 && !search ? (
            <div className="text-center py-12">
              <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">
                MTK siyahısı boşdur
              </Typography>
            </div>
          ) : null}
        </CardBody>
      </Card>

      {/* Modals */}
      <MtkFilterModal
        open={filters.filterOpen}
        onClose={() => filters.setFilterOpen(false)}
        filters={filters.filters}
        onFilterChange={filters.updateFilter}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />

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
