import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtkById } from "@/store/slices/mtkSlice";
import { loadComplexById } from "@/store/slices/complexSlice";
import { loadBuildingById } from "@/store/slices/buildingSlice";
import { setSelectedBlock, loadBlocks, loadBlockById } from "@/store/slices/blockSlice";
import { BlockHeader } from "./components/BlockHeader";
import { BlockActions } from "./components/BlockActions";
import { BlockTable } from "./components/BlockTable";
import { BlockPagination } from "./components/BlockPagination";
import { BlockFormModal } from "./components/modals/BlockFormModal";
import { BlockSearchModal } from "./components/modals/BlockSearchModal";
import { useBlockForm } from "./hooks/useBlockForm";
import { useBlockData } from "./hooks/useBlockData";
import blocksAPI from "./api";
import DynamicToast from "@/components/DynamicToast";

export default function BlocksPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  
  // URL parametrlərindən gələn ID-lər
  const mtkIdFromUrl = searchParams.get("mtk_id");
  const complexIdFromUrl = searchParams.get("complex_id");
  const buildingIdFromUrl = searchParams.get("building_id");

  // State - URL-dən ilk dəyərləri götür
  const [mtkId, setMtkId] = useState(() => {
    if (mtkIdFromUrl) {
      const id = parseInt(mtkIdFromUrl, 10);
      return !isNaN(id) ? id : null;
    }
    return null;
  });
  const [complexId, setComplexId] = useState(() => {
    if (complexIdFromUrl) {
      const id = parseInt(complexIdFromUrl, 10);
      return !isNaN(id) ? id : null;
    }
    return null;
  });
  const [buildingId, setBuildingId] = useState(() => {
    if (buildingIdFromUrl) {
      const id = parseInt(buildingIdFromUrl, 10);
      return !isNaN(id) ? id : null;
    }
    return null;
  });
  // Redux-dan selected Block ID götür
  const selectedBlockId = useAppSelector((state) => state.block.selectedBlockId);
  const selectedBlock = useAppSelector((state) => state.block.selectedBlock);

  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mode, setMode] = useState("create");
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

  // URL parametrlərindən gələn ID-ləri yüklə və state-i yenilə
  useEffect(() => {
    if (mtkIdFromUrl) {
      const id = parseInt(mtkIdFromUrl, 10);
      if (!isNaN(id)) {
        setMtkId(id);
        dispatch(loadMtkById(id));
      }
    } else {
      setMtkId(null);
    }
  }, [mtkIdFromUrl, dispatch]);

  useEffect(() => {
    if (complexIdFromUrl) {
      const id = parseInt(complexIdFromUrl, 10);
      if (!isNaN(id)) {
        setComplexId(id);
        dispatch(loadComplexById(id));
      }
    } else {
      setComplexId(null);
    }
  }, [complexIdFromUrl, dispatch]);

  useEffect(() => {
    if (buildingIdFromUrl) {
      const id = parseInt(buildingIdFromUrl, 10);
      if (!isNaN(id)) {
        setBuildingId(id);
        dispatch(loadBuildingById(id));
      }
    } else {
      setBuildingId(null);
    }
  }, [buildingIdFromUrl, dispatch]);

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
    setFormOpen(true);
  };

  const handleSelect = (item) => {
    dispatch(setSelectedBlock({ id: item.id, block: item }));
    showToast("success", `"${item.name}" Blok seçildi`, "Uğurlu");
  };

  const handleDelete = async (block) => {
    if (!window.confirm(`"${block.name}" blokunu silmək istədiyinizə əminsiniz?`)) {
      return;
    }

    try {
      await blocksAPI.delete(block.id);
      showToast("success", "Blok uğurla silindi", "Uğurlu");
      refresh();
    } catch (error) {
      const errorMessage = error?.message || "Blok silinərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
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

  const handleNameSearchChange = (value) => {
    setSearch((prev) => ({
      ...prev,
      name: value || undefined,
    }));
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

  const handleMtkChange = (value) => {
    const id = value ? parseInt(value, 10) : null;
    setMtkId(id);
    // MTK dəyişəndə Complex və Building-i təmizlə
    setComplexId(null);
    setBuildingId(null);
    // URL-i yenilə
    if (id) {
      navigate(`/dashboard/management/blocks?mtk_id=${id}`, { replace: true });
    } else {
      navigate("/dashboard/management/blocks", { replace: true });
    }
  };

  const handleComplexChange = (value) => {
    const id = value ? parseInt(value, 10) : null;
    setComplexId(id);
    // Complex dəyişəndə Building-i təmizlə
    setBuildingId(null);
    // URL-i yenilə - mtk_id varsa onu da saxla
    const params = new URLSearchParams();
    if (mtkId) {
      params.set("mtk_id", mtkId);
    }
    if (id) {
      params.set("complex_id", id);
    }
    const newUrl = params.toString() ? `/dashboard/management/blocks?${params.toString()}` : "/dashboard/management/blocks";
    navigate(newUrl, { replace: true });
  };

  const handleBuildingChange = (value) => {
    const id = value ? parseInt(value, 10) : null;
    setBuildingId(id);
    // URL-i yenilə - mtk_id və complex_id varsa onları da saxla
    const params = new URLSearchParams();
    if (mtkId) {
      params.set("mtk_id", mtkId);
    }
    if (complexId) {
      params.set("complex_id", complexId);
    }
    if (id) {
      params.set("building_id", id);
    }
    const newUrl = params.toString() ? `/dashboard/management/blocks?${params.toString()}` : "/dashboard/management/blocks";
    navigate(newUrl, { replace: true });
  };

  const handleRemoveFilter = (key) => {
    setSearch((prev) => {
      const newSearch = { ...prev };
      delete newSearch[key];
      return newSearch;
    });
  };

  return (
    <div className="space-y-6">
      <BlockHeader />

      <BlockActions
        search={search}
        mtkId={mtkId}
        complexId={complexId}
        buildingId={buildingId}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onNameSearchChange={handleNameSearchChange}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onMtkChange={handleMtkChange}
        onComplexChange={handleComplexChange}
        onBuildingChange={handleBuildingChange}
        onRemoveFilter={handleRemoveFilter}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <BlockTable
        items={items}
        loading={loading}
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

