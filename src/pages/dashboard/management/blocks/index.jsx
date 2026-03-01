import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedBlock, loadBlocks, loadBlockById } from "@/store/slices/blockSlice";
import { BlockHeader } from "./components/BlockHeader";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";
import { BlockTable } from "./components/BlockTable";
import { BlockPagination } from "./components/BlockPagination";
import { BlockFormModal } from "./components/modals/BlockFormModal";
import { BlockSearchModal } from "./components/modals/BlockSearchModal";
import { useBlockForm } from "./hooks/useBlockForm";
import { useBlockData } from "./hooks/useBlockData";
import blocksAPI from "./api";
import DynamicToast from "@/components/DynamicToast";
import { ViewModal } from "@/components/management/ViewModal";
import { DeleteConfirmModal } from "./components/modals/DeleteConfirmModal";
import { EditConfirmModal } from "./components/modals/EditConfirmModal";
import { BuildingOfficeIcon, CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export default function BlocksPage() {
  const dispatch = useAppDispatch();

  // Redux-dan filter state (global) - ManagementActions tərəfindən idarə olunur
  const mtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const complexId = useAppSelector((state) => state.complex.selectedComplexId);
  const buildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const selectedBlockId = useAppSelector((state) => state.block.selectedBlockId);
  const selectedBlock = useAppSelector((state) => state.block.selectedBlock);

  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useBlockForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useBlockData({
    search,
    complexId,
    buildingId,
    mtkId,
  });

  // Load Blocks to Redux on mount
  useEffect(() => {
    dispatch(loadBlocks({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Load selected Block if ID exists but Block data doesn't
  useEffect(() => {
    if (selectedBlockId && !selectedBlock) {
      dispatch(loadBlockById(selectedBlockId));
    }
  }, [dispatch, selectedBlockId, selectedBlock]);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    setMode("create");
    setFormOpen(true);
  };

  const handleEdit = (block) => {
    form.setFormFromBlock(block);
    setMode("edit");
    setSelected(block);
    setFormOpen(true);
  };

  const handleEditRequest = (formData) => {
    setPendingFormData(formData);
    setEditConfirmOpen(true);
  };

  const confirmEdit = async () => {
    if (!pendingFormData) return;
    const blockId = pendingFormData.id || (selected && selected.id);
    if (!blockId) {
      showToast("error", "Blok ID tapılmadı", "Xəta");
      return;
    }
    setEditConfirmLoading(true);
    try {
      await blocksAPI.update(blockId, pendingFormData);
      showToast("success", "Blok uğurla yeniləndi", "Uğurlu");
      refresh();
      dispatch(loadBlocks({ page: 1, per_page: 1000 }));
      setEditConfirmOpen(false);
      setPendingFormData(null);
      setFormOpen(false);
      form.resetForm();
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
    } finally {
      setEditConfirmLoading(false);
    }
  };

  const handleSelect = (item) => {
    dispatch(setSelectedBlock({ id: item.id, block: item }));
    showToast("success", `"${item.name}" Blok seçildi`, "Uğurlu");
  };

  const handleView = async (item) => {
    if (!item?.id) {
      showToast("error", "Blok ID tapılmadı", "Xəta");
      return;
    }

    setViewLoading(true);
    setViewModalOpen(true);
    try {
      const response = await blocksAPI.getById(item.id);
      const apiData = response?.data?.data || response?.data || response;
      setItemToView(apiData);
    } catch (error) {
      console.error("Error loading Block details:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "Blok məlumatları yüklənərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      setViewModalOpen(false);
      setItemToView(null);
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = (block) => {
    setItemToDelete(block);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await blocksAPI.delete(itemToDelete.id);
      showToast("success", "Blok uğurla silindi", "Uğurlu");
      refresh();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      const errorMessage = error?.message || "Blok silinərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const submitForm = async (formData) => {
    try {
      if (mode === "edit") {
        const blockId = form.formData.id || items.find((item) => item.name === formData.name)?.id;
        if (!blockId) {
          throw new Error("Blok ID tapılmadı");
        }
        await blocksAPI.update(blockId, formData);
        showToast("success", "Blok uğurla yeniləndi", "Uğurlu");
      } else {
        await blocksAPI.add(formData);
        showToast("success", "Blok uğurla əlavə edildi", "Uğurlu");
      }
      refresh();
    } catch (error) {
      const errorMessage = error?.message || "Blok yadda saxlanarkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      throw error;
    }
  };

  const handleApplyNameSearch = (value) => {
    setSearch((prev) => ({
      ...prev,
      name: value || undefined,
    }));
  };

  const handleStatusChange = (value) => {
    setSearch((prev) => ({
      ...prev,
      status: value || undefined,
    }));
  };

  const handleRemoveFilter = (key) => {
    setSearch((prev) => {
      const newSearch = { ...prev };
      delete newSearch[key];
      return newSearch;
    });
  };

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <BlockHeader />

      <ManagementActions
        entityLevel={ENTITY_LEVELS.BLOCK}
        search={search}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onRemoveFilter={handleRemoveFilter}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <BlockTable
        items={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
        selectedBlockId={selectedBlockId}
      />

      <BlockPagination
        page={page}
        lastPage={lastPage}
        total={total}
        onPageChange={goToPage}
      />

      <BlockFormModal
        open={formOpen}
        mode={mode}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        form={form}
        onSubmit={submitForm}
        complexId={complexId}
        buildingId={buildingId}
        mtkId={mtkId}
        onEditRequest={handleEditRequest}
      />

      <BlockSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={(searchParams) => {
          // Keep name and status from current search, merge with advanced search params
          setSearch((prev) => ({
            ...(prev.name && { name: prev.name }),
            ...(prev.status && { status: prev.status }),
            ...searchParams,
          }));
        }}
        currentSearch={search}
      />

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setItemToView(null);
        }}
        title="Blok Məlumatları"
        item={itemToView}
        entityName="blok"
        loading={viewLoading}
        fields={[
          { key: "name", label: "Ad", icon: BuildingOfficeIcon },
          { 
            key: "building.name", 
            label: "Bina",
            icon: BuildingOfficeIcon,
            getValue: (item) => item?.building?.name
          },
          { 
            key: "building.id", 
            label: "Bina ID",
            icon: BuildingOfficeIcon,
            getValue: (item) => item?.building?.id
          },
          { 
            key: "complex.name", 
            label: "Complex",
            icon: BuildingOfficeIcon,
            getValue: (item) => item?.complex?.name
          },
          { 
            key: "complex.id", 
            label: "Complex ID",
            icon: BuildingOfficeIcon,
            getValue: (item) => item?.complex?.id
          },
          { 
            key: "meta.total_floor", 
            label: "Ümumi mərtəbə sayı",
            icon: InformationCircleIcon,
            getValue: (item) => item?.meta?.total_floor
          },
          { 
            key: "meta.total_apartment", 
            label: "Ümumi mənzil sayı",
            icon: InformationCircleIcon,
            getValue: (item) => item?.meta?.total_apartment
          },
          { 
            key: "status", 
            label: "Status",
            icon: CheckCircleIcon
          },
        ]}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Bloku Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="blok"
        loading={deleteLoading}
      />

      <EditConfirmModal
        open={editConfirmOpen}
        onClose={() => {
          setEditConfirmOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmEdit}
        title="Bloku Redaktə et"
        itemName={selected ? `"${selected.name}"` : ""}
        entityName="blok"
        loading={editConfirmLoading}
        oldData={selected}
        newData={pendingFormData}
      />

      <DynamicToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        title={toast.title}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}

