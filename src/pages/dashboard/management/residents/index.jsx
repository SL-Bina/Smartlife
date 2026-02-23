import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedResident, loadResidents, loadResidentById } from "@/store/slices/residentSlice";
import { loadMtks, setSelectedMtk, loadMtkById } from "@/store/slices/mtkSlice";
import { loadComplexes, setSelectedComplex, loadComplexById } from "@/store/slices/complexSlice";
import { loadBuildings, setSelectedBuilding, loadBuildingById } from "@/store/slices/buildingSlice";
import { loadBlocks, setSelectedBlock, loadBlockById } from "@/store/slices/blockSlice";
import { setSelectedProperty, loadProperties, loadPropertyById } from "@/store/slices/propertySlice";
import { ResidentHeader } from "./components/ResidentHeader";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";
import { ResidentTable } from "./components/ResidentTable";
import { ResidentPagination } from "./components/ResidentPagination";
import { ResidentFormModal } from "./components/modals/ResidentFormModal";
import { ResidentSearchModal } from "./components/modals/ResidentSearchModal";
import { useResidentForm } from "./hooks/useResidentForm";
import { useResidentData } from "./hooks/useResidentData";
import residentsAPI from "./api";
import DynamicToast from "@/components/DynamicToast";
import { ViewModal } from "@/components/management/ViewModal";
import { DeleteConfirmModal } from "@/components/management/DeleteConfirmModal";
import { UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import PropertyBindModal from "./components/modals/PropertyBindModal";

export default function ResidentsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  // URL-dən mtk_id, complex_id, building_id, block_id və property_id götür
  const urlMtkId = searchParams.get("mtk_id");
  const urlComplexId = searchParams.get("complex_id");
  const urlBuildingId = searchParams.get("building_id");
  const urlBlockId = searchParams.get("block_id");
  const urlPropertyId = searchParams.get("property_id");

  // Redux-dan selected ID'leri götür
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const selectedBuilding = useAppSelector((state) => state.building.selectedBuilding);
  const selectedBlockId = useAppSelector((state) => state.block.selectedBlockId);
  const selectedBlock = useAppSelector((state) => state.block.selectedBlock);
  const selectedPropertyId = useAppSelector((state) => state.property.selectedPropertyId);
  const selectedProperty = useAppSelector((state) => state.property.selectedProperty);
  const mtks = useAppSelector((state) => state.mtk.mtks);
  const complexes = useAppSelector((state) => state.complex.complexes);
  const buildings = useAppSelector((state) => state.building.buildings);
  const blocks = useAppSelector((state) => state.block.blocks);
  const properties = useAppSelector((state) => state.property.properties);
  const [bindOpen, setBindOpen] = useState(false);

  // Local state for filter values - immediate update
  const [mtkId, setMtkIdState] = useState(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedMtkId || null;
  });

  const [complexId, setComplexIdState] = useState(() => {
    if (urlComplexId) {
      const id = parseInt(urlComplexId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedComplexId || null;
  });

  const [buildingId, setBuildingIdState] = useState(() => {
    if (urlBuildingId) {
      const id = parseInt(urlBuildingId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedBuildingId || null;
  });

  const [blockId, setBlockIdState] = useState(() => {
    if (urlBlockId) {
      const id = parseInt(urlBlockId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedBlockId || null;
  });

  const [propertyId, setPropertyIdState] = useState(() => {
    if (urlPropertyId) {
      const id = parseInt(urlPropertyId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedPropertyId || null;
  });

  const selectedResidentId = useAppSelector((state) => state.resident.selectedResidentId);
  const selectedResident = useAppSelector((state) => state.resident.selectedResident);

  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bindModalOpen, setBindModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useResidentForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useResidentData({ search, mtkId, complexId, buildingId, blockId, propertyId });

  // MTK seçim işleminin bir kez yapılması için flag
  const mtkInitializedRef = useRef(false);

  // Load MTKs, Complexes, Buildings, Blocks, Properties and Residents to Redux on mount
  useEffect(() => {
    dispatch(loadMtks({ page: 1, per_page: 1000 }));
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
    dispatch(loadBuildings({ page: 1, per_page: 1000 }));
    dispatch(loadBlocks({ page: 1, per_page: 1000 }));
    dispatch(loadProperties({ page: 1, per_page: 1000 }));
    dispatch(loadResidents({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Sync filter values with URL changes
  useEffect(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      if (!isNaN(id) && id !== mtkId) setMtkIdState(id);
    }
    if (urlComplexId) {
      const id = parseInt(urlComplexId, 10);
      if (!isNaN(id) && id !== complexId) setComplexIdState(id);
    }
    if (urlBuildingId) {
      const id = parseInt(urlBuildingId, 10);
      if (!isNaN(id) && id !== buildingId) setBuildingIdState(id);
    }
    if (urlBlockId) {
      const id = parseInt(urlBlockId, 10);
      if (!isNaN(id) && id !== blockId) setBlockIdState(id);
    }
    if (urlPropertyId) {
      const id = parseInt(urlPropertyId, 10);
      if (!isNaN(id) && id !== propertyId) setPropertyIdState(id);
    }
  }, [urlMtkId, urlComplexId, urlBuildingId, urlBlockId, urlPropertyId]);

  const handleApplyNameSearch = (value) => {
    setSearch((prev) => ({
      ...prev,
      name: value && value.trim() ? value.trim() : undefined,
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
          setComplexIdState(null);
          dispatch(setSelectedComplex({ id: null, complex: null }));
          break;
        case "building":
          setBuildingIdState(null);
          dispatch(setSelectedBuilding({ id: null, building: null }));
          break;
        case "block":
          setBlockIdState(null);
          dispatch(setSelectedBlock({ id: null, block: null }));
          break;
        case "property":
          setPropertyIdState(null);
          dispatch(setSelectedProperty({ id: null, property: null }));
          break;
      }
    });

    // Build URL params
    const params = new URLSearchParams();

    // Set the changed filter and get parent values
    switch (filterType) {
      case "mtk":
        setMtkIdState(value);
        if (value) {
          params.set("mtk_id", value);
          const result = await dispatch(loadMtkById(value));
          if (result.payload) {
            dispatch(setSelectedMtk({ id: value, mtk: result.payload }));
          }
        } else {
          dispatch(setSelectedMtk({ id: null, mtk: null }));
        }
        break;
      case "complex":
        setComplexIdState(value);
        if (mtkId) params.set("mtk_id", mtkId);
        if (value) {
          params.set("complex_id", value);
          const result = await dispatch(loadComplexById(value));
          if (result.payload) {
            dispatch(setSelectedComplex({ id: value, complex: result.payload }));
          }
        } else {
          dispatch(setSelectedComplex({ id: null, complex: null }));
        }
        break;
      case "building":
        setBuildingIdState(value);
        if (mtkId) params.set("mtk_id", mtkId);
        if (complexId) params.set("complex_id", complexId);
        if (value) {
          params.set("building_id", value);
          const result = await dispatch(loadBuildingById(value));
          if (result.payload) {
            dispatch(setSelectedBuilding({ id: value, building: result.payload }));
          }
        } else {
          dispatch(setSelectedBuilding({ id: null, building: null }));
        }
        break;
      case "block":
        setBlockIdState(value);
        if (mtkId) params.set("mtk_id", mtkId);
        if (complexId) params.set("complex_id", complexId);
        if (buildingId) params.set("building_id", buildingId);
        if (value) {
          params.set("block_id", value);
          const result = await dispatch(loadBlockById(value));
          if (result.payload) {
            dispatch(setSelectedBlock({ id: value, block: result.payload }));
          }
        } else {
          dispatch(setSelectedBlock({ id: null, block: null }));
        }
        break;
      case "property":
        setPropertyIdState(value);
        if (mtkId) params.set("mtk_id", mtkId);
        if (complexId) params.set("complex_id", complexId);
        if (buildingId) params.set("building_id", buildingId);
        if (blockId) params.set("block_id", blockId);
        if (value) {
          params.set("property_id", value);
          const result = await dispatch(loadPropertyById(value));
          if (result.payload) {
            dispatch(setSelectedProperty({ id: value, property: result.payload }));
          }
        } else {
          dispatch(setSelectedProperty({ id: null, property: null }));
        }
        break;
    }

    // Navigate with new params
    const queryString = params.toString();
    navigate(`/dashboard/management/residents${queryString ? `?${queryString}` : ""}`, { replace: true });
  };

  const handleRemoveFilter = (filterKey) => {
    setSearch((prev) => {
      const newSearch = { ...prev };
      delete newSearch[filterKey];
      Object.keys(newSearch).forEach((key) => {
        if (!newSearch[key] || (typeof newSearch[key] === 'string' && !newSearch[key].trim())) {
          delete newSearch[key];
        }
      });
      return newSearch;
    });
  };

  // Load Residents to Redux on mount
  useEffect(() => {
    dispatch(loadResidents({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Load selected Resident if ID exists but Resident data doesn't
  useEffect(() => {
    if (selectedResidentId && !selectedResident) {
      dispatch(loadResidentById(selectedResidentId));
    }
  }, [dispatch, selectedResidentId, selectedResident]);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleView = (item) => {
    setItemToView(item);
    setViewModalOpen(true);
  };

  const handleEdit = (item) => {
    form.setFormFromResident(item);
    setMode("edit");
    setSelected(item);
    setFormOpen(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeleteLoading(true);
    try {
      await residentsAPI.delete(itemToDelete.id);
      showToast("success", "Sakin uğurla silindi", "Uğurlu");
      refresh();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelect = (item) => {
    dispatch(setSelectedResident({ id: item.id, resident: item }));
    showToast("success", `"${item.name} ${item.surname}" Sakin seçildi`, "Uğurlu");
  };

  const submitForm = async (formData) => {
    try {
      if (mode === "create") {
        await residentsAPI.add(formData);
        showToast("success", "Sakin uğurla əlavə edildi", "Uğurlu");
      } else {
        await residentsAPI.update(selected.id, formData);
        showToast("success", "Sakin uğurla yeniləndi", "Uğurlu");
      }
      refresh();
      form.resetForm();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <ResidentHeader />

      <ManagementActions
        entityLevel={ENTITY_LEVELS.RESIDENT}
        search={search}
        filterValues={{
          mtkId,
          complexId,
          buildingId,
          blockId,
          propertyId,
        }}
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

      <ResidentTable
        items={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onBind={(resident) => {
          dispatch(setSelectedResident({ id: resident.id, resident }));
          setBindModalOpen(true);
        }}
        onDelete={handleDelete}
        onSelect={handleSelect}
        selectedResidentId={selectedResidentId}
      />

      {lastPage > 1 && (
        <ResidentPagination
          page={page}
          lastPage={lastPage}
          onPageChange={goToPage}
          total={total}
        />
      )}

      <ResidentFormModal
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
        propertyId={propertyId}
      />

      <PropertyBindModal

        open={bindModalOpen}
        onClose={() => setBindModalOpen(false)}
        residentId={selectedResidentId}
        residentProperties={selectedResident?.properties}
        onSuccess={() => {
          if (selectedResidentId) {
            dispatch(loadResidentById(selectedResidentId));
          }
        }}
      />

      <ResidentSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={(searchParams) => {
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
        title="Sakin Məlumatları"
        item={itemToView}
        entityName="sakin"
        fields={[
          { key: "name", label: "Ad", icon: UserIcon },
          { key: "surname", label: "Soyad", icon: UserIcon },
          { key: "email", label: "E-mail", icon: EnvelopeIcon },
          { key: "phone", label: "Telefon", icon: PhoneIcon },
          {
            key: "gender",
            label: "Cins",
            icon: UserIcon,
            format: (value) => value === "male" ? "Kişi" : value === "female" ? "Qadın" : value || "-"
          },
          {
            key: "type",
            label: "Tip",
            icon: IdentificationIcon,
            format: (value) => value === "owner" ? "Sahib" : value === "tenant" ? "Kirayəçi" : value || "-"
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
        title="Sakini Sil"
        itemName={itemToDelete ? `"${itemToDelete.name} ${itemToDelete.surname}"` : ""}
        entityName="sakin"
        loading={deleteLoading}
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
