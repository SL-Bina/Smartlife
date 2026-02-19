import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtkById } from "@/store/slices/mtkSlice";
import { loadComplexById } from "@/store/slices/complexSlice";
import { loadBuildingById } from "@/store/slices/buildingSlice";
import { loadBlockById, setSelectedBlock } from "@/store/slices/blockSlice";
import { setSelectedProperty, loadProperties, loadPropertyById } from "@/store/slices/propertySlice";
import { PropertyHeader } from "./components/PropertyHeader";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";
import { PropertyTable } from "./components/PropertyTable";
import { PropertyPagination } from "./components/PropertyPagination";
import { PropertyFormModal } from "./components/modals/PropertyFormModal";
import { PropertySearchModal } from "./components/modals/PropertySearchModal";
import { PropertyServiceFeeModal } from "./components/modals/PropertyServiceFeeModal";
import { usePropertyForm } from "./hooks/usePropertyForm";
import { usePropertyData } from "./hooks/usePropertyData";
import propertiesAPI from "./api";
import DynamicToast from "@/components/DynamicToast";

export default function PropertiesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  
  // URL parametrlərindən gələn ID-lər
  const mtkIdFromUrl = searchParams.get("mtk_id");
  const complexIdFromUrl = searchParams.get("complex_id");
  const buildingIdFromUrl = searchParams.get("building_id");
  const blockIdFromUrl = searchParams.get("block_id");

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
  const [blockId, setBlockId] = useState(() => {
    if (blockIdFromUrl) {
      const id = parseInt(blockIdFromUrl, 10);
      return !isNaN(id) ? id : null;
    }
    return null;
  });
  // Redux-dan selected Property ID götür
  const selectedPropertyId = useAppSelector((state) => state.property.selectedPropertyId);
  const selectedProperty = useAppSelector((state) => state.property.selectedProperty);

  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [serviceFeeModalOpen, setServiceFeeModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("create");
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = usePropertyForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = usePropertyData({
    search,
    mtkId,
    complexId,
    buildingId,
    blockId,
  });

  // Load Properties to Redux on mount
  useEffect(() => {
    dispatch(loadProperties({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Load selected Property if ID exists but Property data doesn't
  useEffect(() => {
    if (selectedPropertyId && !selectedProperty) {
      dispatch(loadPropertyById(selectedPropertyId));
    }
  }, [dispatch, selectedPropertyId, selectedProperty]);

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

  useEffect(() => {
    if (blockIdFromUrl) {
      const id = parseInt(blockIdFromUrl, 10);
      if (!isNaN(id)) {
        setBlockId(id);
        dispatch(loadBlockById(id));
      }
    } else {
      setBlockId(null);
    }
  }, [blockIdFromUrl, dispatch]);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    setMode("create");
    setFormOpen(true);
  };

  const handleEdit = (property) => {
    form.setFormFromProperty(property);
    setMode("edit");
    setFormOpen(true);
  };

  const handleSelect = (item) => {
    dispatch(setSelectedProperty({ id: item.id, property: item }));
    showToast("success", `"${item.name || item.apartment_number || `Mənzil #${item.id}`}" Mənzil seçildi`, "Uğurlu");
  };

  const handleDelete = async (property) => {
    if (!window.confirm(`"${property.name}" mənzilini silmək istədiyinizə əminsiniz?`)) {
      return;
    }

    try {
      await propertiesAPI.delete(property.id);
      showToast("success", "Mənzil uğurla silindi", "Uğurlu");
      refresh();
    } catch (error) {
      const errorMessage = error?.message || "Mənzil silinərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
    }
  };

  const handleServiceFee = (property) => {
    setSelected(property);
    setServiceFeeModalOpen(true);
  };

  const submitForm = async (formData) => {
    try {
      if (mode === "edit") {
        const propertyId = form.formData.id || items.find((item) => item.name === formData.name)?.id;
        if (!propertyId) {
          throw new Error("Mənzil ID tapılmadı");
        }
        await propertiesAPI.update(propertyId, formData);
        showToast("success", "Mənzil uğurla yeniləndi", "Uğurlu");
      } else {
        await propertiesAPI.add(formData);
        showToast("success", "Mənzil uğurla əlavə edildi", "Uğurlu");
      }
      refresh();
    } catch (error) {
      const errorMessage = error?.message || "Mənzil yadda saxlanarkən xəta baş verdi";
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

  // Filter change handler for ManagementActions
  const handleFilterChange = async (filterType, value, filtersToReset = []) => {
    // Reset child filters
    filtersToReset.forEach((filter) => {
      switch (filter) {
        case "complex":
          setComplexId(null);
          break;
        case "building":
          setBuildingId(null);
          break;
        case "block":
          setBlockId(null);
          dispatch(setSelectedBlock({ id: null, block: null }));
          break;
      }
    });

    // Build URL params
    const params = new URLSearchParams();
    
    switch (filterType) {
      case "mtk":
        if (value) {
          setMtkId(value);
          params.set("mtk_id", value);
          dispatch(loadMtkById(value));
        } else {
          setMtkId(null);
        }
        break;
      case "complex":
        if (mtkId) params.set("mtk_id", mtkId);
        if (value) {
          setComplexId(value);
          params.set("complex_id", value);
          dispatch(loadComplexById(value));
        } else {
          setComplexId(null);
        }
        break;
      case "building":
        if (mtkId) params.set("mtk_id", mtkId);
        if (complexId) params.set("complex_id", complexId);
        if (value) {
          setBuildingId(value);
          params.set("building_id", value);
          dispatch(loadBuildingById(value));
        } else {
          setBuildingId(null);
        }
        break;
      case "block":
        if (mtkId) params.set("mtk_id", mtkId);
        if (complexId) params.set("complex_id", complexId);
        if (buildingId) params.set("building_id", buildingId);
        if (value) {
          setBlockId(value);
          params.set("block_id", value);
          const result = await dispatch(loadBlockById(value));
          if (result.payload) {
            dispatch(setSelectedBlock({ id: value, block: result.payload }));
          }
        } else {
          setBlockId(null);
          dispatch(setSelectedBlock({ id: null, block: null }));
        }
        break;
    }

    const queryString = params.toString();
    navigate(`/dashboard/management/properties${queryString ? `?${queryString}` : ""}`, { replace: true });
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
      <PropertyHeader />

      <ManagementActions
        entityLevel={ENTITY_LEVELS.PROPERTY}
        search={search}
        filterValues={{ mtkId, complexId, buildingId, blockId }}
        onFilterChange={handleFilterChange}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onRemoveFilter={handleRemoveFilter}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <PropertyTable
        items={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onServiceFee={handleServiceFee}
        onSelect={handleSelect}
        selectedPropertyId={selectedPropertyId}
      />

      <PropertyPagination
        page={page}
        lastPage={lastPage}
        total={total}
        onPageChange={goToPage}
      />

      <PropertyFormModal
        open={formOpen}
        mode={mode}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        form={form}
        onSubmit={submitForm}
        mtkId={mtkId}
        complexId={complexId}
        buildingId={buildingId}
        blockId={blockId}
      />

      <PropertySearchModal
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

      <PropertyServiceFeeModal
        open={serviceFeeModalOpen}
        propertyId={selected?.id}
        propertyName={selected?.name || selected?.apartment_number || `Mənzil #${selected?.id}`}
        onClose={() => {
          setServiceFeeModalOpen(false);
          setSelected(null);
        }}
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

