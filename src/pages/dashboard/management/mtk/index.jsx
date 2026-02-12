import React, { useMemo, useState } from "react";
import { Card, CardBody, Spinner, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";

import { MtkHeader } from "./components/MtkHeader";
import { MtkActions } from "./components/MtkActions";
import { MtkTable } from "./components/MtkTable";
import { MtkCardList } from "./components/MtkCardList";
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
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { colorCode } = useMtkColor();

  const [search, setSearch] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [mode, setMode] = useState("create"); 
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
    refresh();
  };

  const handleFilterClear = () => {
    filters.clearFilters();
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

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getCardBackground = () => {
    if (colorCode && sidenavType === "white") {
      const color1 = getRgbaColor(colorCode, 0.05);
      const color2 = getRgbaColor(colorCode, 0.03);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    if (colorCode && sidenavType === "dark") {
      const color1 = getRgbaColor(colorCode, 0.1);
      const color2 = getRgbaColor(colorCode, 0.07);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    return {};
  };

  const cardTypes = {
    dark: colorCode ? "" : "dark:bg-gray-800/50",
    white: colorCode ? "" : "bg-white/80 dark:bg-gray-800/50",
    transparent: "",
  };

  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-3 mb-6">
        <MtkHeader />
      </div>

      <Card 
        className={`
          rounded-3xl xl:rounded-[2rem]
          backdrop-blur-2xl backdrop-saturate-150
          border
          ${cardTypes[sidenavType] || ""} 
          ${colorCode ? "" : "border-gray-200/50 dark:border-gray-700/50"}
          shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.3)]
          dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)]
        `}
        style={{
          ...getCardBackground(),
          borderColor: colorCode ? getRgbaColor(colorCode, 0.15) : undefined,
        }}
      >
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

          <div className="hidden lg:block">
            <MtkTable
              items={items}
              loading={loading}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDelete}
              onGoComplex={() => navigate("/dashboard/management/complex")}
            />
          </div>

          <div className="lg:hidden">
            <MtkCardList
              items={items}
              loading={loading}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDelete}
              onGoComplex={() => navigate("/dashboard/management/complex")}
            />
          </div>

          {!loading && items.length > 0 && (
            <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <MtkPagination page={page} lastPage={lastPage} total={total} onPageChange={goToPage} />
          </div>
          )}

          {!loading && items.length === 0 && !search ? (
            <div className="text-center py-12">
              <Typography className="text-sm font-medium text-gray-800 dark:text-gray-100">
                MTK siyahısı boşdur
              </Typography>
            </div>
          ) : null}
        </CardBody>
      </Card>

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
