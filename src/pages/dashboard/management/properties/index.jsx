import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtkById } from "@/store/slices/mtkSlice";
import { loadComplexById } from "@/store/slices/complexSlice";
import { loadBuildingById } from "@/store/slices/buildingSlice";
import { loadBlockById, setSelectedBlock } from "@/store/slices/blockSlice";
import { setSelectedProperty, loadProperties, loadPropertyById } from "@/store/slices/propertySlice";
import { PropertyHeader } from "./components/PropertyHeader";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";
import { PropertyTable } from "./components/PropertyTable";
import { PropertyCardList } from "./components/PropertyCardList";
import { PropertyFloorView } from "./components/PropertyFloorView";
import { PropertyPagination } from "./components/PropertyPagination";
import { PropertyFormModal } from "./components/modals/PropertyFormModal";
import { PropertySearchModal } from "./components/modals/PropertySearchModal";
import { PropertyServiceFeeModal } from "./components/modals/PropertyServiceFeeModal";
import { usePropertyForm } from "./hooks/usePropertyForm";
import { usePropertyData } from "./hooks/usePropertyData";
import propertiesAPI from "./api";
import DynamicToast from "@/components/DynamicToast";
import { ViewModal } from "@/components/management/ViewModal";
import { DeleteConfirmModal } from "@/components/management/DeleteConfirmModal";
import { 
  HomeIcon, 
  IdentificationIcon, 
  BuildingOfficeIcon, 
  InformationCircleIcon, 
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  Square3Stack3DIcon,
  BuildingOffice2Icon,
  Squares2X2Icon,
  TableCellsIcon
} from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";

export default function PropertiesPage() {
  const dispatch = useAppDispatch();

  const mtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const complexId = useAppSelector((state) => state.complex.selectedComplexId);
  const buildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const blockId = useAppSelector((state) => state.block.selectedBlockId);
  const selectedPropertyId = useAppSelector((state) => state.property.selectedPropertyId);
  const selectedProperty = useAppSelector((state) => state.property.selectedProperty);

  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [serviceFeeModalOpen, setServiceFeeModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("create");
  const [viewMode, setViewMode] = useState("table"); // "table" | "floor"
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

  // Artıq URL sync lazim deyil - Redux state istifadə edirik

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    setMode("create");
    setFormOpen(true);
  };

  const handleEdit = (property) => {
    console.log("editing property:", property);
    form.setFormFromProperty(property);
    setMode("edit");
    setFormOpen(true);
  };

  const handleSelect = (item) => {
    dispatch(setSelectedProperty({ id: item.id, property: item }));
    showToast("success", `"${item.name || item.apartment_number || `Mənzil #${item.id}`}" Mənzil seçildi`, "Uğurlu");
  };

  const handleView = (item) => {
    setItemToView(item);
    setViewModalOpen(true);
  };

  const handleDelete = (property) => {
    setItemToDelete(property);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await propertiesAPI.delete(itemToDelete.id);
      showToast("success", "Mənzil uğurla silindi", "Uğurlu");
      refresh();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      const errorMessage = error?.message || "Mənzil silinərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleServiceFee = (property) => {
    setSelected(property);
    setServiceFeeModalOpen(true);
  };

  const submitForm = async (formData) => {
    try {
      if (mode === "edit") {
        // Redaktə rejimində form.formData.id istifadə et, ad axtarışı etmə
        const propertyId = form.formData.id;
        if (!propertyId) {
          throw new Error("Mənzil ID tapılmadı");
        }
        
        // Debug log - backend-ə gedən məlumatları yoxla
        console.log("Backend-ə göndərilən PATCH data:", {
          propertyId,
          formData,
          endpoint: `/module/properties/${propertyId}`
        });
        
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

  // Filter state artıq ManagementActions tərəfindən Redux-da idarə olunur

  const handleRemoveFilter = (key) => {
    setSearch((prev) => {
      const newSearch = { ...prev };
      delete newSearch[key];
      return newSearch;
    });
  };

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <PropertyHeader />

      <ManagementActions
        entityLevel={ENTITY_LEVELS.PROPERTY}
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

      <div className="flex items-center justify-between gap-2">
        {/* Total count */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 rounded-lg">
          <HomeIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
            Ümumi: <span className="font-bold">{total}</span> mənzil
          </span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <Button
            variant={viewMode === "table" ? "filled" : "text"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={`
              flex items-center gap-2 px-3 py-2
              ${viewMode === "table" 
                ? "bg-blue-600 text-white" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }
            `}
          >
            <TableCellsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Cədvəl</span>
          </Button>
          <Button
            variant={viewMode === "floor" ? "filled" : "text"}
            size="sm"
            onClick={() => setViewMode("floor")}
            className={`
              flex items-center gap-2 px-3 py-2
              ${viewMode === "floor" 
                ? "bg-blue-600 text-white" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }
            `}
          >
            <Squares2X2Icon className="h-4 w-4" />
            <span className="hidden sm:inline">Mərtəbə</span>
          </Button>
        </div>
      </div>

      {/* Conditional Rendering */}
      {viewMode === "table" ? (
        <>
          <PropertyTable
            items={items}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onServiceFee={handleServiceFee}
            onSelect={handleSelect}
            selectedPropertyId={selectedPropertyId}
          />
          <PropertyCardList
            items={items}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onServiceFee={handleServiceFee}
            onSelect={handleSelect}
            selectedPropertyId={selectedPropertyId}
          />
        </>
      ) : (
        <PropertyFloorView
          items={items}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onServiceFee={handleServiceFee}
          onSelect={handleSelect}
          selectedPropertyId={selectedPropertyId}
        />
      )}

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

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setItemToView(null);
        }}
        title="Mənzil Məlumatları"
        item={itemToView}
        entityName="mənzil"
        fields={[
          { key: "name", label: "Ad", icon: HomeIcon },
          { 
            key: "meta.apartment_number", 
            label: "Mənzil Nömrəsi", 
            icon: IdentificationIcon,
            getValue: (item) => item.meta?.apartment_number || item.apartment_number
          },
          { 
            key: "meta.area", 
            label: "Sahə (m²)", 
            icon: Square3Stack3DIcon,
            getValue: (item) => item.meta?.area ? `${item.meta.area} m²` : null
          },
          { 
            key: "meta.floor", 
            label: "Mərtəbə", 
            icon: BuildingOffice2Icon,
            getValue: (item) => item.meta?.floor || null
          },
          { 
            key: "sub_data.block.name", 
            label: "Blok",
            icon: BuildingOfficeIcon,
            getValue: (item) => item.sub_data?.block?.name || item.bind_block?.name
          },
          { 
            key: "sub_data.building.name", 
            label: "Bina",
            icon: BuildingOfficeIcon,
            getValue: (item) => item.sub_data?.building?.name || item.bind_building?.name
          },
          { 
            key: "sub_data.complex.name", 
            label: "Complex",
            icon: BuildingOfficeIcon,
            getValue: (item) => item.sub_data?.complex?.name || item.bind_complex?.name
          },
          { 
            key: "sub_data.mtk.name", 
            label: "MTK",
            icon: BuildingOfficeIcon,
            getValue: (item) => item.sub_data?.mtk?.name || item.bind_mtk?.name
          },
          { 
            key: "sub_data.mtk.meta.address", 
            label: "MTK Ünvanı",
            icon: MapPinIcon,
            fullWidth: true,
            getValue: (item) => item.sub_data?.mtk?.meta?.address || item.bind_mtk?.meta?.address
          },
          { 
            key: "sub_data.mtk.meta.phone", 
            label: "MTK Telefon",
            icon: PhoneIcon,
            getValue: (item) => item.sub_data?.mtk?.meta?.phone || item.bind_mtk?.meta?.phone
          },
          { 
            key: "sub_data.mtk.meta.email", 
            label: "MTK E-mail",
            icon: EnvelopeIcon,
            getValue: (item) => item.sub_data?.mtk?.meta?.email || item.bind_mtk?.meta?.email
          },
          { 
            key: "sub_data.mtk.meta.website", 
            label: "MTK Website",
            icon: GlobeAltIcon,
            getValue: (item) => item.sub_data?.mtk?.meta?.website || item.bind_mtk?.meta?.website
          },
          { 
            key: "sub_data.complex.meta.address", 
            label: "Complex Ünvanı",
            icon: MapPinIcon,
            fullWidth: true,
            getValue: (item) => item.sub_data?.complex?.meta?.address || item.bind_complex?.meta?.address
          },
          { 
            key: "sub_data.complex.meta.phone", 
            label: "Complex Telefon",
            icon: PhoneIcon,
            getValue: (item) => item.sub_data?.complex?.meta?.phone || item.bind_complex?.meta?.phone
          },
          { 
            key: "sub_data.complex.meta.email", 
            label: "Complex E-mail",
            icon: EnvelopeIcon,
            getValue: (item) => item.sub_data?.complex?.meta?.email || item.bind_complex?.meta?.email
          },
          { 
            key: "sub_data.building.meta.desc", 
            label: "Bina Təsviri",
            icon: InformationCircleIcon,
            fullWidth: true,
            getValue: (item) => item.sub_data?.building?.meta?.desc || item.bind_building?.meta?.desc
          },
          { 
            key: "sub_data.block.meta.total_floor", 
            label: "Blok Ümumi Mərtəbə",
            icon: BuildingOffice2Icon,
            getValue: (item) => item.sub_data?.block?.meta?.total_floor || null
          },
          { 
            key: "sub_data.block.meta.total_apartment", 
            label: "Blok Ümumi Mənzil Sayı",
            icon: HomeIcon,
            getValue: (item) => item.sub_data?.block?.meta?.total_apartment || null
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
        title="Mənzili Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="mənzil"
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

